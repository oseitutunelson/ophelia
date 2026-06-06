import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

import db from '@/lib/db';
import { paystack } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

function parseMeta(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, unknown>;
  return {};
}

export async function POST(req: Request) {
  try {
    // Session is guaranteed here — called from browser with cookies
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });
    }

    const { reference } = await req.json() as { reference: string };
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference.' }, { status: 400 });
    }

    // Verify with Paystack
    const { data: res } = await paystack.get(`/transaction/verify/${reference}`);
    console.log('[PAYSTACK_VERIFY] status:', res?.status, res?.data?.status);

    if (!res?.status || res.data?.status !== 'success') {
      console.error('[PAYSTACK_VERIFY] failed:', res?.data?.gateway_response);
      return NextResponse.json(
        { error: `Payment verification failed: ${res?.data?.gateway_response ?? 'unknown'}` },
        { status: 400 }
      );
    }

    const meta = parseMeta(res.data.metadata);
    const plan = (String(meta.plan ?? 'individual')) as 'individual' | 'agency';

    // Get username from DB for redirect
    const profile = await db.profile.findFirst({ where: { userId } });
    const username = profile?.username ?? (meta.username ? String(meta.username) : null);

    // Update Clerk publicMetadata — immediately visible across the platform
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        isPro:       true,
        isAgencyPro: plan === 'agency',
        proSince:    new Date().toISOString()
      }
    });
    console.log('[PAYSTACK_VERIFY] Clerk metadata updated for', userId);

    // Best-effort DB write (fully active after prisma generate on next deploy)
    try {
      await (db.profile as any).updateMany({
        where: { userId },
        data:  { isPro: true, isAgencyPro: plan === 'agency' }
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true, username, plan });
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err?.message;
    console.error('[PAYSTACK_VERIFY]', msg ?? err);
    return NextResponse.json(
      { error: msg ?? 'Verification failed. Please contact support.' },
      { status: 500 }
    );
  }
}
