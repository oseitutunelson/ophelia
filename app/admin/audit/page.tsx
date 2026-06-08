'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ScrollText, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AuditLog {
  id: string; adminId: string; action: string; target?: string; details?: string; createdAt: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  APPROVE_INSTRUCTOR: { label: 'Approved Instructor', color: 'text-emerald-600 bg-emerald-50' },
  REJECT_INSTRUCTOR: { label: 'Rejected Instructor', color: 'text-red-600 bg-red-50' },
  REVIEW_INSTRUCTOR: { label: 'Marked Under Review', color: 'text-blue-600 bg-blue-50' },
  BAN_USER: { label: 'Banned User', color: 'text-red-600 bg-red-50' },
  UNBAN_USER: { label: 'Unbanned User', color: 'text-emerald-600 bg-emerald-50' },
  DELETE_USER: { label: 'Deleted User', color: 'text-red-700 bg-red-50' },
  UPGRADE_PRO: { label: 'Upgraded to Pro', color: 'text-violet-600 bg-violet-50' },
  DOWNGRADE_PRO: { label: 'Downgraded Pro', color: 'text-amber-600 bg-amber-50' },
  FEATURE_COURSE: { label: 'Featured Course', color: 'text-amber-600 bg-amber-50' },
  UNFEATURE_COURSE: { label: 'Unfeatured Course', color: 'text-[#6b6b7b] bg-[#f4f4f8]' },
  UNPUBLISH_COURSE: { label: 'Unpublished Course', color: 'text-orange-600 bg-orange-50' },
  PUBLISH_COURSE: { label: 'Published Course', color: 'text-emerald-600 bg-emerald-50' },
  DELETE_COURSE: { label: 'Deleted Course', color: 'text-red-600 bg-red-50' },
  FEATURE_BLOG: { label: 'Featured Blog Post', color: 'text-amber-600 bg-amber-50' },
  UNPUBLISH_BLOG: { label: 'Unpublished Blog', color: 'text-orange-600 bg-orange-50' },
  DELETE_BLOG: { label: 'Deleted Blog Post', color: 'text-red-600 bg-red-50' },
  APPROVE_AD: { label: 'Approved Ad Campaign', color: 'text-emerald-600 bg-emerald-50' },
  PAUSE_AD: { label: 'Paused Ad Campaign', color: 'text-amber-600 bg-amber-50' },
  REJECT_AD: { label: 'Rejected Ad Campaign', color: 'text-red-600 bg-red-50' },
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async (p: number) => {
    setLoading(true);
    const res = await axios.get(`/api/admin/audit?page=${p}`);
    setLogs(res.data.logs);
    setTotal(res.data.total);
    setPages(res.data.pages);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(page); }, [page, fetch]);

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Audit Log</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>{total.toLocaleString()} admin actions recorded</p>
      </div>

      {loading ? (
        <div className='space-y-2'>{[1,2,3,4,5].map(i=><div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}</div>
      ) : logs.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'><ScrollText className='h-10 w-10 mx-auto mb-3 opacity-40'/><p>No actions logged yet</p></div>
      ) : (
        <>
          <div className='bg-white border border-[#e8e8ec] rounded-xl divide-y divide-[#f8f8fa]'>
            {logs.map(log => {
              const meta = ACTION_LABELS[log.action];
              return (
                <div key={log.id} className='flex items-start gap-4 px-5 py-4 hover:bg-[#fafafa]'>
                  <div className='w-8 h-8 rounded-full bg-[#c9a96e]/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <CheckCircle className='h-4 w-4 text-[#c9a96e]' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${meta?.color ?? 'text-[#6b6b7b] bg-[#f4f4f8]'}`}>
                        {meta?.label ?? log.action}
                      </span>
                      {log.target && (
                        <span className='text-[11px] text-[#9898a8] font-mono truncate max-w-[200px]'>{log.target}</span>
                      )}
                    </div>
                    {log.details && <p className='text-[12px] text-[#6b6b7b] mt-0.5'>{log.details}</p>}
                    <p className='text-[11px] text-[#9898a8] mt-1 font-mono'>Admin: {log.adminId}</p>
                  </div>
                  <p className='text-[11px] text-[#9898a8] flex-shrink-0 mt-0.5'>
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </p>
                </div>
              );
            })}
          </div>
          {pages > 1 && (
            <div className='flex items-center justify-between mt-4'>
              <p className='text-[12px] text-[#9898a8]'>Page {page} of {pages}</p>
              <div className='flex gap-2'>
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className='px-3 py-1.5 border border-[#e8e8ec] rounded-lg text-[12px] disabled:opacity-40 hover:bg-[#f4f4f8]'>Prev</button>
                <button onClick={() => setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className='px-3 py-1.5 border border-[#e8e8ec] rounded-lg text-[12px] disabled:opacity-40 hover:bg-[#f4f4f8]'>Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
