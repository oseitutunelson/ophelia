'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Eye, Clock, GraduationCap, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Application {
  id: string; userId: string; fullName: string; bio: string; expertise: string[];
  experience: string; portfolioUrl?: string; sampleLessonUrl?: string;
  status: string; reviewNote?: string; createdAt: string;
}

const STATUSES = ['pending', 'under_review', 'approved', 'rejected'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', under_review: 'Under Review', approved: 'Approved', rejected: 'Rejected',
};
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminInstructorsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [apps, setApps] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  async function fetchApps(status: string) {
    setLoading(true);
    const res = await axios.get(`/api/admin/instructors?status=${status}`);
    setApps(res.data.applications);
    setLoading(false);
  }

  useEffect(() => { fetchApps(activeTab); }, [activeTab]);

  async function handleAction(appId: string, status: string) {
    setActing(appId + status);
    try {
      await axios.patch(`/api/admin/instructors/${appId}`, { status, reviewNote });
      setSelected(null);
      setReviewNote('');
      fetchApps(activeTab);
    } catch {
      alert('Action failed');
    } finally {
      setActing('');
    }
  }

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Instructor Applications</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>Review and manage instructor applications</p>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 mb-6 border-b border-[#e8e8ec]'>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors duration-150 ${
              activeTab === s ? 'border-[#c9a96e] text-[#0f0f14]' : 'border-transparent text-[#6b6b7b] hover:text-[#0f0f14]'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[1, 2, 3].map(i => <div key={i} className='h-20 bg-[#f4f4f8] rounded-xl animate-pulse' />)}
        </div>
      ) : apps.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'>
          <GraduationCap className='h-10 w-10 mx-auto mb-3 opacity-40' />
          <p className='text-[14px]'>No {STATUS_LABELS[activeTab].toLowerCase()} applications</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {apps.map(app => (
            <div key={app.id} className='bg-white border border-[#e8e8ec] rounded-xl p-5 flex items-start gap-4'>
              <div className='w-10 h-10 rounded-full bg-[#c9a96e]/15 flex items-center justify-center flex-shrink-0'>
                <span className='text-[#c9a96e] font-bold text-sm'>{app.fullName[0]}</span>
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='font-semibold text-[14px] text-[#0f0f14]'>{app.fullName}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[app.status]}`}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1.5 mb-2'>
                  {app.expertise.map(e => (
                    <span key={e} className='text-[11px] bg-[#f4f4f8] text-[#6b6b7b] px-2 py-0.5 rounded-full'>{e}</span>
                  ))}
                </div>
                <p className='text-[12px] text-[#6b6b7b] line-clamp-2'>{app.bio}</p>
                <div className='flex items-center gap-4 mt-2'>
                  <span className='text-[11px] text-[#9898a8] flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                  </span>
                  {app.portfolioUrl && (
                    <a href={app.portfolioUrl} target='_blank' rel='noopener noreferrer' className='text-[11px] text-[#c9a96e] flex items-center gap-0.5 hover:underline'>
                      Portfolio <ExternalLink className='h-3 w-3' />
                    </a>
                  )}
                  {app.sampleLessonUrl && (
                    <a href={app.sampleLessonUrl} target='_blank' rel='noopener noreferrer' className='text-[11px] text-[#c9a96e] flex items-center gap-0.5 hover:underline'>
                      Sample Lesson <ExternalLink className='h-3 w-3' />
                    </a>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2 flex-shrink-0'>
                <button onClick={() => { setSelected(app); setReviewNote(''); }} className='flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f4f8] text-[#6b6b7b] text-[12px] rounded-lg hover:bg-[#ebebef] transition-colors'>
                  <Eye className='h-3.5 w-3.5' /> Review
                </button>
                {app.status !== 'approved' && (
                  <button
                    onClick={() => handleAction(app.id, 'approved')}
                    disabled={acting === app.id + 'approved'}
                    className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50'
                  >
                    <CheckCircle className='h-3.5 w-3.5' /> Approve
                  </button>
                )}
                {app.status !== 'rejected' && (
                  <button
                    onClick={() => handleAction(app.id, 'rejected')}
                    disabled={acting === app.id + 'rejected'}
                    className='flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-[12px] rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50'
                  >
                    <XCircle className='h-3.5 w-3.5' /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto'>
            <div className='p-6 border-b border-[#e8e8ec]'>
              <div className='flex items-center justify-between'>
                <h2 className='text-[18px] font-bold text-[#0f0f14]'>{selected.fullName}</h2>
                <button onClick={() => setSelected(null)} className='text-[#9898a8] hover:text-[#0f0f14] text-xl leading-none'>×</button>
              </div>
            </div>
            <div className='p-6 space-y-4'>
              <Section label='Bio' value={selected.bio} />
              <Section label='Expertise' value={selected.expertise.join(', ')} />
              <Section label='Experience' value={selected.experience} />
              {selected.portfolioUrl && <Section label='Portfolio' value={selected.portfolioUrl} link />}
              {selected.sampleLessonUrl && <Section label='Sample Lesson' value={selected.sampleLessonUrl} link />}
              <div>
                <p className='text-[12px] text-[#6b6b7b] mb-1 font-medium'>Review Note (optional)</p>
                <textarea
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  placeholder='Add a note to this applicant...'
                  rows={3}
                  className='w-full border border-[#e8e8ec] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#c9a96e]'
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  onClick={() => handleAction(selected.id, 'approved')}
                  disabled={!!acting}
                  className='flex-1 py-2.5 bg-emerald-600 text-white text-[13px] font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50'
                >
                  Approve Instructor
                </button>
                <button
                  onClick={() => handleAction(selected.id, 'rejected')}
                  disabled={!!acting}
                  className='flex-1 py-2.5 bg-red-600 text-white text-[13px] font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleAction(selected.id, 'under_review')}
                  disabled={!!acting}
                  className='flex-1 py-2.5 bg-[#f4f4f8] text-[#6b6b7b] text-[13px] font-medium rounded-lg hover:bg-[#ebebef] transition-colors disabled:opacity-50'
                >
                  Mark Under Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div>
      <p className='text-[12px] text-[#9898a8] font-medium mb-0.5'>{label}</p>
      {link ? (
        <a href={value} target='_blank' rel='noopener noreferrer' className='text-[13px] text-[#c9a96e] hover:underline break-all'>{value}</a>
      ) : (
        <p className='text-[13px] text-[#0f0f14] break-words'>{value}</p>
      )}
    </div>
  );
}
