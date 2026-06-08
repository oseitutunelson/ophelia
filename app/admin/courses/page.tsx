'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Search, Star, Star as StarFilled, Eye, EyeOff, Trash2, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminCourse {
  id: string; slug: string; title: string; category: string; level: string;
  price: number; isFree: boolean; isPublished: boolean; isFeatured: boolean;
  enrollmentCount: number; rating: number; ratingCount: number;
  instructor: { userId: string }; _count: { enrollments: number }; createdAt: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  const fetch = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await axios.get(`/api/admin/courses?q=${q}&page=${p}`);
    setCourses(res.data.courses);
    setTotal(res.data.total);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(query, page); }, [query, page, fetch]);

  async function action(courseId: string, act: string) {
    setActing(courseId + act);
    try {
      await axios.patch(`/api/admin/courses/${courseId}`, { action: act });
      fetch(query, page);
    } catch { alert('Failed'); } finally { setActing(''); }
  }

  async function deleteCourse(courseId: string) {
    if (!confirm('Delete this course permanently?')) return;
    setActing(courseId + 'delete');
    try {
      await axios.delete(`/api/admin/courses/${courseId}`);
      fetch(query, page);
    } catch { alert('Failed'); } finally { setActing(''); }
  }

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Course Management</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>{total.toLocaleString()} courses total</p>
      </div>
      <form onSubmit={e => { e.preventDefault(); setQuery(input); setPage(1); }} className='flex gap-2 mb-6'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9898a8]' />
          <input value={input} onChange={e => setInput(e.target.value)} placeholder='Search courses...' className='w-full pl-9 pr-4 py-2.5 border border-[#e8e8ec] rounded-lg text-[13px] focus:outline-none focus:border-[#c9a96e] bg-white' />
        </div>
        <button type='submit' className='px-4 py-2.5 bg-[#0f0f14] text-white text-[13px] font-medium rounded-lg'>Search</button>
      </form>
      {loading ? (
        <div className='space-y-2'>{[1,2,3].map(i=><div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}</div>
      ) : courses.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'><BookOpen className='h-10 w-10 mx-auto mb-3 opacity-40'/><p className='text-[14px]'>No courses found</p></div>
      ) : (
        <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[#f0f0f4]'>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>COURSE</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden lg:table-cell'>CATEGORY</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>PRICE</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>ENROLLED</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>STATUS</th>
                <th className='text-right text-[11px] font-semibold text-[#9898a8] px-4 py-3'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className='border-b border-[#f8f8fa] last:border-0 hover:bg-[#fafafa]'>
                  <td className='px-4 py-3'>
                    <p className='text-[13px] font-medium text-[#0f0f14] line-clamp-1'>{c.title}</p>
                    <p className='text-[11px] text-[#9898a8]'>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</p>
                  </td>
                  <td className='px-4 py-3 hidden lg:table-cell'><span className='text-[12px] text-[#6b6b7b]'>{c.category}</span></td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] font-medium text-[#0f0f14]'>{c.isFree ? 'Free' : `$${c.price}`}</span></td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] text-[#6b6b7b]'>{c._count.enrollments}</span></td>
                  <td className='px-4 py-3'>
                    <div className='flex gap-1'>
                      {c.isPublished ? <span className='text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full'>Published</span> : <span className='text-[11px] bg-[#f4f4f8] text-[#6b6b7b] px-2 py-0.5 rounded-full'>Draft</span>}
                      {c.isFeatured && <span className='text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full'>Featured</span>}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      <button onClick={() => action(c.id, c.isFeatured ? 'unfeature' : 'feature')} disabled={!!acting} title={c.isFeatured ? 'Unfeature' : 'Feature'} className='p-1.5 rounded-lg hover:bg-amber-50 text-[#9898a8] hover:text-amber-600 transition-colors'>
                        <Star className='h-4 w-4' />
                      </button>
                      <button onClick={() => action(c.id, c.isPublished ? 'unpublish' : 'publish')} disabled={!!acting} title={c.isPublished ? 'Unpublish' : 'Publish'} className='p-1.5 rounded-lg hover:bg-blue-50 text-[#9898a8] hover:text-blue-600 transition-colors'>
                        {c.isPublished ? <EyeOff className='h-4 w-4'/> : <Eye className='h-4 w-4'/>}
                      </button>
                      <button onClick={() => deleteCourse(c.id)} disabled={!!acting} title='Delete' className='p-1.5 rounded-lg hover:bg-red-50 text-[#9898a8] hover:text-red-600 transition-colors'>
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
