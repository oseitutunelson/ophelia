'use client';

import { useRef } from 'react';
import { Award, Download, Share2 } from 'lucide-react';

interface CertificateViewerProps {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completedAt: string;
  certificateId: string;
}

export default function CertificateViewer({
  studentName, courseTitle, instructorName, completedAt, certificateId,
}: CertificateViewerProps) {
  const certRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const text = `I just completed "${courseTitle}" on Ophelia! 🎓 Certificate ID: ${certificateId}`;
    if (navigator.share) {
      await navigator.share({ title: 'My Ophelia Certificate', text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  const date = new Date(completedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div>
      {/* Action buttons */}
      <div className='flex gap-3 mb-8 print:hidden'>
        <button
          onClick={handlePrint}
          className='flex items-center gap-2 px-5 py-2.5 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200'
        >
          <Download className='h-4 w-4' /> Download / Print
        </button>
        <button
          onClick={handleShare}
          className='flex items-center gap-2 px-5 py-2.5 border border-lux-border text-lux-black text-sm font-medium hover:bg-lux-hover transition-colors duration-200'
        >
          <Share2 className='h-4 w-4' /> Share
        </button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className='relative bg-white border-8 border-double border-[#c9a96e] p-12 text-center max-w-3xl mx-auto shadow-luxury print:shadow-none print:border-4'
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        {/* Corner decorations */}
        <div className='absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c9a96e]/60' />
        <div className='absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c9a96e]/60' />
        <div className='absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#c9a96e]/60' />
        <div className='absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c9a96e]/60' />

        {/* Logo / Brand */}
        <div className='flex justify-center mb-6'>
          <div className='flex items-center gap-2'>
            <Award className='h-8 w-8 text-[#c9a96e]' />
            <span className='text-2xl font-bold text-lux-black tracking-widest uppercase'>Ophelia</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className='text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-8'>
          Certificate of Completion
        </p>

        {/* Divider */}
        <div className='flex items-center gap-4 mb-8'>
          <div className='flex-1 h-px bg-[#c9a96e]/30' />
          <div className='h-1.5 w-1.5 bg-[#c9a96e] rotate-45' />
          <div className='flex-1 h-px bg-[#c9a96e]/30' />
        </div>

        {/* This is to certify */}
        <p className='text-sm text-lux-mid mb-2'>This is to certify that</p>
        <h1 className='text-4xl font-bold text-lux-black mb-4 leading-tight'>{studentName}</h1>
        <p className='text-sm text-lux-mid mb-2'>has successfully completed the course</p>
        <h2 className='text-2xl font-semibold text-lux-black mb-6 leading-tight max-w-lg mx-auto'>
          "{courseTitle}"
        </h2>

        {/* Divider */}
        <div className='flex items-center gap-4 mb-8'>
          <div className='flex-1 h-px bg-[#c9a96e]/30' />
          <div className='h-1.5 w-1.5 bg-[#c9a96e] rotate-45' />
          <div className='flex-1 h-px bg-[#c9a96e]/30' />
        </div>

        {/* Details row */}
        <div className='flex justify-between items-end mt-2'>
          <div className='text-left'>
            <div className='h-px w-32 bg-lux-black/30 mb-1' />
            <p className='text-xs text-lux-mid'>{instructorName}</p>
            <p className='text-xs text-lux-muted'>Instructor</p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-lux-muted mb-1'>Issued on</p>
            <p className='text-sm font-semibold text-lux-black'>{date}</p>
          </div>
          <div className='text-right'>
            <div className='h-px w-32 bg-lux-black/30 mb-1 ml-auto' />
            <p className='text-xs text-lux-mid'>Ophelia Platform</p>
            <p className='text-xs text-lux-muted'>Verified Credential</p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className='mt-6 pt-4 border-t border-[#c9a96e]/20'>
          <p className='text-xs text-lux-muted'>Certificate ID: <span className='text-lux-mid font-mono'>{certificateId}</span></p>
        </div>
      </div>
    </div>
  );
}
