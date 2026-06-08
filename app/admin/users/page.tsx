'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Search, UserX, UserCheck, TrendingUp, TrendingDown, Trash2, Shield, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminUser {
  id: string; name: string; email: string; imageUrl: string;
  createdAt: string; isBanned: boolean; isPro: boolean; isAgencyPro: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ userId: string; action: string; name: string } | null>(null);

  const fetchUsers = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await axios.get(`/api/admin/users?q=${q}&page=${p}`);
    setUsers(res.data.users);
    setTotal(res.data.total);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(query, page); }, [query, page, fetchUsers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(searchInput);
    setPage(1);
  }

  async function doAction(userId: string, action: string, reason?: string) {
    setActing(userId + action);
    try {
      await axios.patch(`/api/admin/users/${userId}`, { action, reason });
      fetchUsers(query, page);
    } catch {
      alert('Action failed');
    } finally {
      setActing('');
      setConfirmModal(null);
    }
  }

  const totalPages = Math.ceil(total / 30);

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>User Management</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>{total.toLocaleString()} total users</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className='flex gap-2 mb-6'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9898a8]' />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder='Search by name or email...'
            className='w-full pl-9 pr-4 py-2.5 border border-[#e8e8ec] rounded-lg text-[13px] focus:outline-none focus:border-[#c9a96e] bg-white'
          />
        </div>
        <button type='submit' className='px-4 py-2.5 bg-[#0f0f14] text-white text-[13px] font-medium rounded-lg hover:bg-[#1a1a24] transition-colors'>
          Search
        </button>
      </form>

      {loading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse' />)}
        </div>
      ) : users.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'>
          <Users className='h-10 w-10 mx-auto mb-3 opacity-40' />
          <p className='text-[14px]'>No users found</p>
        </div>
      ) : (
        <>
          <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[#f0f0f4]'>
                  <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>USER</th>
                  <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden sm:table-cell'>JOINED</th>
                  <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>STATUS</th>
                  <th className='text-right text-[11px] font-semibold text-[#9898a8] px-4 py-3'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className='border-b border-[#f8f8fa] last:border-0 hover:bg-[#fafafa]'>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='relative w-8 h-8 rounded-full overflow-hidden bg-[#e8e8ec] flex-shrink-0'>
                          <Image src={user.imageUrl} alt={user.name} fill className='object-cover' onError={() => {}} />
                        </div>
                        <div>
                          <p className='text-[13px] font-medium text-[#0f0f14]'>{user.name}</p>
                          <p className='text-[11px] text-[#9898a8]'>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 hidden sm:table-cell'>
                      <p className='text-[12px] text-[#6b6b7b]'>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-1.5'>
                        {user.isBanned && <span className='text-[11px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full'>Banned</span>}
                        {user.isAgencyPro && <span className='text-[11px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full'>Agency Pro</span>}
                        {user.isPro && !user.isAgencyPro && <span className='text-[11px] bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full'>Pro</span>}
                        {!user.isBanned && !user.isPro && !user.isAgencyPro && <span className='text-[11px] bg-[#f4f4f8] text-[#6b6b7b] px-2 py-0.5 rounded-full'>Free</span>}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-1'>
                        {user.isBanned ? (
                          <button onClick={() => doAction(user.id, 'unban')} disabled={acting === user.id + 'unban'} title='Unban' className='p-1.5 rounded-lg hover:bg-emerald-50 text-[#9898a8] hover:text-emerald-600 transition-colors'>
                            <UserCheck className='h-4 w-4' />
                          </button>
                        ) : (
                          <button onClick={() => setConfirmModal({ userId: user.id, action: 'ban', name: user.name })} title='Ban' className='p-1.5 rounded-lg hover:bg-red-50 text-[#9898a8] hover:text-red-600 transition-colors'>
                            <UserX className='h-4 w-4' />
                          </button>
                        )}
                        {!user.isPro && !user.isAgencyPro && (
                          <button onClick={() => doAction(user.id, 'upgrade_pro')} disabled={acting === user.id + 'upgrade_pro'} title='Upgrade to Pro' className='p-1.5 rounded-lg hover:bg-violet-50 text-[#9898a8] hover:text-violet-600 transition-colors'>
                            <TrendingUp className='h-4 w-4' />
                          </button>
                        )}
                        {(user.isPro || user.isAgencyPro) && (
                          <button onClick={() => doAction(user.id, 'downgrade_pro')} disabled={acting === user.id + 'downgrade_pro'} title='Downgrade Pro' className='p-1.5 rounded-lg hover:bg-amber-50 text-[#9898a8] hover:text-amber-600 transition-colors'>
                            <TrendingDown className='h-4 w-4' />
                          </button>
                        )}
                        <button onClick={() => setConfirmModal({ userId: user.id, action: 'delete', name: user.name })} title='Delete' className='p-1.5 rounded-lg hover:bg-red-50 text-[#9898a8] hover:text-red-600 transition-colors'>
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between mt-4'>
              <p className='text-[12px] text-[#9898a8]'>Page {page} of {totalPages}</p>
              <div className='flex gap-2'>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='px-3 py-1.5 border border-[#e8e8ec] rounded-lg text-[12px] disabled:opacity-40 hover:bg-[#f4f4f8]'>Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='px-3 py-1.5 border border-[#e8e8ec] rounded-lg text-[12px] disabled:opacity-40 hover:bg-[#f4f4f8]'>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm modal */}
      {confirmModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-sm p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-full bg-red-50 flex items-center justify-center'>
                <Shield className='h-5 w-5 text-red-600' />
              </div>
              <div>
                <p className='font-semibold text-[14px] text-[#0f0f14]'>
                  {confirmModal.action === 'delete' ? 'Delete User' : 'Ban User'}
                </p>
                <p className='text-[12px] text-[#6b6b7b]'>{confirmModal.name}</p>
              </div>
            </div>
            <p className='text-[13px] text-[#6b6b7b] mb-4'>
              {confirmModal.action === 'delete'
                ? 'This will permanently delete this user and all their data. This cannot be undone.'
                : 'This will flag this user as banned across the platform.'}
            </p>
            <div className='flex gap-3'>
              <button onClick={() => setConfirmModal(null)} className='flex-1 py-2.5 border border-[#e8e8ec] rounded-lg text-[13px] hover:bg-[#f4f4f8]'>Cancel</button>
              <button
                onClick={() => doAction(confirmModal.userId, confirmModal.action)}
                className='flex-1 py-2.5 bg-red-600 text-white text-[13px] font-medium rounded-lg hover:bg-red-700'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
