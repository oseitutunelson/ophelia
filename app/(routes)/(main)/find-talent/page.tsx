import TalentList from '@/components/talent-list';

export const metadata = {
  title: 'Find Fashion Talent — Ophelia',
  description: 'Hire top fashion designers and creative professionals for your next project.'
};

export default function FindTalentPage() {
  return (
    <main className='min-h-screen'>
      <TalentList />
    </main>
  );
}
