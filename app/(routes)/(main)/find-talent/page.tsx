import TalentList from '@/components/talent-list';

export const metadata = {
  title: 'Find Fashion Talent - Ophelia',
  description: 'Hire top fashion designers and creative professionals for your fashion projects.'
};

export default function FindTalentPage() {
  return (
    <main className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-6 lg:px-10 py-12'>
        <TalentList />
      </div>
    </main>
  );
}
