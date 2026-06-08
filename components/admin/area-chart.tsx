'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts';

export interface ChartDataPoint {
  date: string;
  [key: string]: number | string;
}

interface AreaChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataKey: string;
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

export function AreaChartCard({ title, data, dataKey, color = '#c9a96e', height = 180, formatValue }: AreaChartCardProps) {
  return (
    <div className='bg-white border border-[#e8e8ec] rounded-xl p-5'>
      <p className='text-[13px] font-semibold text-[#0f0f14] mb-4'>{title}</p>
      <ResponsiveContainer width='100%' height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={color} stopOpacity={0.15} />
              <stop offset='95%' stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f4' vertical={false} />
          <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#9898a8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9898a8' }} tickLine={false} axisLine={false} tickFormatter={formatValue} />
          <Tooltip
            contentStyle={{ background: '#0f0f14', border: 'none', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9898a8' }}
            itemStyle={{ color: color }}
            formatter={(value) => [formatValue ? formatValue(value as number) : value, dataKey]}
          />
          <Area type='monotone' dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BarChartCardProps {
  title: string;
  data: ChartDataPoint[];
  bars: { key: string; color: string; label: string }[];
  height?: number;
}

export function BarChartCard({ title, data, bars, height = 180 }: BarChartCardProps) {
  return (
    <div className='bg-white border border-[#e8e8ec] rounded-xl p-5'>
      <p className='text-[13px] font-semibold text-[#0f0f14] mb-4'>{title}</p>
      <ResponsiveContainer width='100%' height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f4' vertical={false} />
          <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#9898a8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9898a8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f0f14', border: 'none', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9898a8' }}
          />
          <Legend iconType='circle' iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          {bars.map(b => <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
