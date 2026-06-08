import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, logAdminAction } from '@/lib/admin';
import { clerkClient } from '@clerk/nextjs';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, reason } = await req.json() as { action: string; reason?: string };
  const { userId } = params;

  switch (action) {
    case 'ban': {
      await db.userBan.upsert({
        where: { userId },
        create: { userId, reason, bannedBy: adminId },
        update: { reason, bannedBy: adminId, bannedAt: new Date() },
      });
      await logAdminAction(adminId, 'BAN_USER', userId, reason);
      break;
    }
    case 'unban': {
      await db.userBan.deleteMany({ where: { userId } });
      await logAdminAction(adminId, 'UNBAN_USER', userId);
      break;
    }
    case 'upgrade_pro': {
      await db.profile.updateMany({
        where: { userId },
        data: { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
      await logAdminAction(adminId, 'UPGRADE_PRO', userId, 'Manual admin upgrade');
      break;
    }
    case 'downgrade_pro': {
      await db.profile.updateMany({
        where: { userId },
        data: { isPro: false, isAgencyPro: false, proExpiresAt: null },
      });
      await logAdminAction(adminId, 'DOWNGRADE_PRO', userId);
      break;
    }
    case 'delete': {
      try {
        await clerkClient.users.deleteUser(userId);
      } catch { /* proceed even if Clerk delete fails */ }
      await db.profile.deleteMany({ where: { userId } });
      await logAdminAction(adminId, 'DELETE_USER', userId);
      break;
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
