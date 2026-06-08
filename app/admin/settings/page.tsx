import { Settings, Shield, Key, CreditCard, DollarSign, Mail, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Platform Settings</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>Configuration overview and environment variables</p>
      </div>

      <div className='space-y-4 max-w-2xl'>

        {/* Admin Access */}
        <SettingCard icon={<Shield className='h-5 w-5'/>} title='Admin Access Control' accent='#c9a96e'>
          <SettingRow label='Admin User IDs' value='Set via ADMIN_USER_IDS environment variable' mono />
          <p className='text-[12px] text-[#9898a8] mt-2'>
            Comma-separated Clerk user IDs. Example: <code className='bg-[#f4f4f8] px-1.5 py-0.5 rounded text-[11px]'>ADMIN_USER_IDS=user_abc,user_xyz</code>
          </p>
        </SettingCard>

        {/* Stripe */}
        <SettingCard icon={<CreditCard className='h-5 w-5'/>} title='Stripe Payments' accent='#6366f1'>
          <SettingRow label='API Key' value='STRIPE_SECRET_KEY' mono />
          <SettingRow label='Webhook Secret' value='STRIPE_WEBHOOK_SECRET' mono />
          <SettingRow label='Pro Price ID' value='STRIPE_PRO_PRICE_ID' mono />
          <SettingRow label='Agency Price ID' value='STRIPE_AGENCY_PRICE_ID' mono />
        </SettingCard>

        {/* Paystack */}
        <SettingCard icon={<DollarSign className='h-5 w-5'/>} title='Paystack Payments' accent='#10b981'>
          <SettingRow label='Secret Key' value='PAYSTACK_SECRET_KEY' mono />
          <SettingRow label='Pro Plan Code' value='PAYSTACK_PRO_PLAN_CODE' mono />
          <SettingRow label='Agency Plan Code' value='PAYSTACK_AGENCY_PLAN_CODE' mono />
        </SettingCard>

        {/* Authentication */}
        <SettingCard icon={<Key className='h-5 w-5'/>} title='Authentication (Clerk)' accent='#7c3aed'>
          <SettingRow label='Publishable Key' value='NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY' mono />
          <SettingRow label='Secret Key' value='CLERK_SECRET_KEY' mono />
        </SettingCard>

        {/* Pricing Reference */}
        <SettingCard icon={<Settings className='h-5 w-5'/>} title='Platform Pricing'>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: 'Pro Subscription', value: '$12 / month' },
              { label: 'Agency Pro', value: '$49 / month' },
              { label: 'Instructor Revenue Share', value: '80% (individual)' },
              { label: 'Agency Revenue Share', value: '90% (agency)' },
              { label: 'Platform Fee (courses)', value: '10–20%' },
              { label: 'Ad Duration Options', value: '7 / 14 / 30 days' },
            ].map(item => (
              <div key={item.label} className='bg-[#f8f8fa] rounded-lg p-3'>
                <p className='text-[11px] text-[#9898a8]'>{item.label}</p>
                <p className='text-[14px] font-semibold text-[#0f0f14] mt-0.5'>{item.value}</p>
              </div>
            ))}
          </div>
        </SettingCard>

        {/* Database */}
        <SettingCard icon={<Globe className='h-5 w-5'/>} title='Database & Storage' accent='#ef4444'>
          <SettingRow label='MongoDB URL' value='DATABASE_URL' mono />
          <SettingRow label='EdgeStore Access Key' value='EDGE_STORE_ACCESS_KEY' mono />
          <SettingRow label='EdgeStore Secret Key' value='EDGE_STORE_SECRET_KEY' mono />
        </SettingCard>

      </div>
    </div>
  );
}

function SettingCard({ icon, title, accent = '#6b6b7b', children }: { icon: React.ReactNode; title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
      <div className='flex items-center gap-3 px-5 py-4 border-b border-[#f0f0f4]'>
        <span style={{ color: accent }}>{icon}</span>
        <p className='text-[14px] font-semibold text-[#0f0f14]'>{title}</p>
      </div>
      <div className='px-5 py-4'>{children}</div>
    </div>
  );
}

function SettingRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='flex items-center justify-between py-2 border-b border-[#f8f8fa] last:border-0'>
      <p className='text-[12px] text-[#6b6b7b]'>{label}</p>
      <p className={`text-[12px] text-[#0f0f14] ${mono ? 'font-mono bg-[#f4f4f8] px-2 py-0.5 rounded text-[11px]' : 'font-medium'}`}>{value}</p>
    </div>
  );
}
