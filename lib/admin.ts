import { auth } from '@clerk/nextjs';
import db from '@/lib/db';

export function getAdminIds(): string[] {
  return (process.env.ADMIN_USER_IDS ?? '').split(',').filter(Boolean);
}

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return getAdminIds().includes(userId);
}

export async function requireAdminApi(): Promise<string | null> {
  const { userId } = auth();
  if (!userId || !isAdmin(userId)) return null;
  return userId;
}

export async function logAdminAction(
  adminId: string,
  action: string,
  target?: string,
  details?: string
) {
  try {
    await db.auditLog.create({ data: { adminId, action, target, details } });
  } catch {
    // Non-critical
  }
}
