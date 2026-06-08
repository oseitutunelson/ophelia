import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';

export const metadata = { title: 'Admin — Ophelia' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  const adminIds = (process.env.ADMIN_USER_IDS ?? '').split(',').filter(Boolean);

  if (!userId || !adminIds.includes(userId)) {
    redirect('/');
  }

  return (
    <div className='flex h-screen bg-[#f4f4f8] overflow-hidden'>
      <AdminSidebar />
      <main className='flex-1 overflow-y-auto'>
        {children}
      </main>
    </div>
  );
}
