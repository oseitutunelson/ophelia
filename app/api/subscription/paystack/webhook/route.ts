import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { clerkClient } from '@clerk/nextjs';

import db from '@/lib/db';

export const dynamic = 'force-dynamic';

function parseMeta(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, unknown>;
  return {};
}

async function resolveUserId(email: string, meta: Record<string, unknown>): Promise<string | null> {
  // 1. Try userId from metadata
  if (meta.userId) return String(meta.userId);

  // 2. Look up by email via Clerk
  try {
    const result = await clerkClient.users.getUserList({ emailAddress: [email] });
    const list: any[] = Array.isArray(result) ? result : ((result as any).data ?? []);
    if (list.length > 0) return list[0].id;
  } catch { /* noop */ }

  return null;
}

export async function POST(req: Request) {
  const body = await req.text();

  // Verify Paystack HMAC-SHA512 signature
  const signature = headers().get('x-paystack-signature') ?? '';
  const secret    = process.env.PAYSTACK_SECRET_KEY ?? '';
  const hash      = createHmac('sha512', secret).update(body).digest('hex');

  if (hash !== signature) {
    console.error('[PAYSTACK_WEBHOOK] invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('[PAYSTACK_WEBHOOK] event:', event.event);

  if (event.event === 'charge.success') {
    const data  = event.data;
    const email = data?.customer?.email as string | undefined;
    const meta  = parseMeta(data?.metadata);
    const plan  = (String(meta.plan ?? 'individual')) as 'individual' | 'agency';

    if (!email) {
      console.error('[PAYSTACK_WEBHOOK] no email in event');
      return NextResponse.json({ received: true });
    }

    const userId = await resolveUserId(email, meta);

    if (!userId) {
      console.error('[PAYSTACK_WEBHOOK] could not resolve userId for email:', email);
      return NextResponse.json({ received: true });
    }

    // Update Clerk metadata
    try {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          isPro:       true,
          isAgencyPro: plan === 'agency',
          proSince:    new Date().toISOString()
        }
      });
      console.log('[PAYSTACK_WEBHOOK] Clerk metadata updated for', userId);
    } catch (err) {
      console.error('[PAYSTACK_WEBHOOK] Clerk update failed:', err);
    }

    // Best-effort DB write
    try {
      await (db.profile as any).updateMany({
        where: { userId },
        data:  { isPro: true, isAgencyPro: plan === 'agency' }
      });
    } catch { /* non-fatal */ }
  }

  return NextResponse.json({ received: true });
}
