'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Search, Star, EyeOff, Trash2, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminPost {
  id: string; slug: string; title: string; category: string; authorId: string;
  status: string; viewCount: number; featured: boolean; createdAt: string;
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  const fetch = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await axios.get(`/api/admin/blogs?q=${q}&page=${p}`);
    setPosts(res.data.posts);
    setTotal(res.data.total);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(query, page); }, [query, page, fetch]);

  async function act(postId: string, action: string) {
    setActing(postId + action);
    try {
      await axios.patch(`/api/admin/blogs/${postId}`, { action });
      fetch(query, page);
    } catch { alert('Failed'); } finally { setActing(''); }
  }

  async function del(postId: string) {
    if (!confirm('Delete this post permanently?')) return;
    await axios.delete(`/api/admin/blogs/${postId}`);
    fetch(query, page);
  }

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Blog Management</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>{total.toLocaleString()} posts total</p>
      </div>
      <form onSubmit={e => { e.preventDefault(); setQuery(input); setPage(1); }} className='flex gap-2 mb-6'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9898a8]' />
          <input value={input} onChange={e => setInput(e.target.value)} placeholder='Search posts...' className='w-full pl-9 pr-4 py-2.5 border border-[#e8e8ec] rounded-lg text-[13px] focus:outline-none focus:border-[#c9a96e] bg-white' />
        </div>
        <button type='submit' className='px-4 py-2.5 bg-[#0f0f14] text-white text-[13px] font-medium rounded-lg'>Search</button>
      </form>
      {loading ? (
        <div className='space-y-2'>{[1,2,3].map(i=><div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}</div>
      ) : posts.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'><Newspaper className='h-10 w-10 mx-auto mb-3 opacity-40'/><p>No posts found</p></div>
      ) : (
        <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[#f0f0f4]'>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>TITLE</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>CATEGORY</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>VIEWS</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>STATUS</th>
                <th className='text-right text-[11px] font-semibold text-[#9898a8] px-4 py-3'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className='border-b border-[#f8f8fa] last:border-0 hover:bg-[#fafafa]'>
                  <td className='px-4 py-3'>
                    <p className='text-[13px] font-medium text-[#0f0f14] line-clamp-1'>{p.title}</p>
                    <p className='text-[11px] text-[#9898a8]'>{formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</p>
                  </td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] text-[#6b6b7b]'>{p.category}</span></td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] text-[#6b6b7b]'>{p.viewCount.toLocaleString()}</span></td>
                  <td className='px-4 py-3'>
                    <div className='flex gap-1'>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#f4f4f8] text-[#6b6b7b] border-transparent'}`}>{p.status}</span>
                      {p.featured && <span className='text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full'>Featured</span>}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      <button onClick={() => act(p.id, p.featured ? 'unfeature' : 'feature')} disabled={!!acting} title={p.featured ? 'Unfeature' : 'Feature'} className='p-1.5 rounded-lg hover:bg-amber-50 text-[#9898a8] hover:text-amber-600 transition-colors'>
                        <Star className='h-4 w-4'/>
                      </button>
                      {p.status === 'published' && (
                        <button onClick={() => act(p.id, 'unpublish')} disabled={!!acting} title='Unpublish' className='p-1.5 rounded-lg hover:bg-orange-50 text-[#9898a8] hover:text-orange-600 transition-colors'>
                          <EyeOff className='h-4 w-4'/>
                        </button>
                      )}
                      <button onClick={() => del(p.id)} disabled={!!acting} title='Delete' className='p-1.5 rounded-lg hover:bg-red-50 text-[#9898a8] hover:text-red-600 transition-colors'>
                        <Trash2 className='h-4 w-4'/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
