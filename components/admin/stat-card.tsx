interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  change?: number;
  icon: React.ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, sub, change, icon, accent = '#c9a96e' }: StatCardProps) {
  return (
    <div className='bg-white border border-[#e8e8ec] rounded-xl p-5 flex items-start gap-4'>
      <div className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: accent + '18' }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-[12px] text-[#6b6b7b] font-medium mb-1'>{label}</p>
        <p className='text-[22px] font-bold text-[#0f0f14] leading-none'>{value}</p>
        {sub && <p className='text-[11px] text-[#9898a8] mt-1'>{sub}</p>}
        {change !== undefined && (
          <p className={`text-[11px] mt-1 font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}% this month
          </p>
        )}
      </div>
    </div>
  );
}
