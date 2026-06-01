import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

import db from '@/lib/db';
import { paystack } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

function parseMeta(raw: unknown): Record<string, string> {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (typeof raw === 'object') return raw as Record<string, string>;
  return {};
}

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

  try {
    const reference = req.nextUrl.searchParams.get('reference')
      ?? req.nextUrl.searchParams.get('trxref');

    if (!reference) {
      console.error('[PAYSTACK_VERIFY] no reference in query');
      return NextResponse.redirect(`${appUrl}/go-pro?error=missing_reference`);
    }

    const { data: res } = await paystack.get(`/transaction/verify/${reference}`);

    console.log('[PAYSTACK_VERIFY] full response:', JSON.stringify(res, null, 2));

    if (!res?.status || res.data?.status !== 'success') {
      console.error('[PAYSTACK_VERIFY] payment not successful:', res?.data?.status, res?.data?.gateway_response);
      return NextResponse.redirect(`${appUrl}/go-pro?error=payment_failed`);
    }

    const txData   = res.data;
    const meta     = parseMeta(txData.metadata);
    const email    = txData.customer?.email as string | undefined;
    const plan     = (meta.plan ?? 'individual') as 'individual' | 'agency';

    console.log('[PAYSTACK_VERIFY] meta:', meta, 'email:', email, 'plan:', plan);

    // 1. Try userId from metadata first
    let userId   = meta.userId as string | undefined;
    let username = meta.username as string | undefined;

    // 2. Fallback: look up by email via Clerk if userId missing
    if (!userId && email) {
      const found = await clerkClient.users.getUserList({ emailAddress: [email] });
      if (found.length > 0) userId = found[0].id;
    }

    // 3. Get username from DB if missing from metadata
    if (userId && !username) {
      const profile = await db.profile.findFirst({ where: { userId } });
      username = profile?.username ?? undefined;
    }

    if (!userId) {
      console.error('[PAYSTACK_VERIFY] could not resolve userId');
      return NextResponse.redirect(`${appUrl}/go-pro?error=user_not_found`);
    }

    // 4. Update Clerk publicMetadata (source of truth for badge display)
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        isPro:       true,
        isAgencyPro: plan === 'agency',
        proSince:    new Date().toISOString()
      }
    });

    console.log('[PAYSTACK_VERIFY] Clerk metadata updated for', userId);

    // 5. Best-effort DB write (fully active after prisma generate on next deploy)
    try {
      await (db.profile as any).updateMany({
        where: { userId },
        data:  { isPro: true, isAgencyPro: plan === 'agency' }
      });
    } catch { /* non-fatal */ }

    // 6. Redirect to profile page — server component will read fresh Clerk data
    const destination = username ? `${appUrl}/${username}` : `${appUrl}/go-pro/success`;
    console.log('[PAYSTACK_VERIFY] redirecting to', destination);
    return NextResponse.redirect(destination);

  } catch (err) {
    console.error('[PAYSTACK_VERIFY] unexpected error:', err);
    return NextResponse.redirect(`${appUrl}/go-pro?error=server_error`);
  }
}
