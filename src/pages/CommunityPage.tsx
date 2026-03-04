import React, { useEffect, useMemo, useState } from 'react';
import { FaFish, FaMapMarkerAlt, FaUser, FaUsers, FaWeight } from 'react-icons/fa';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { CommunityCatchesService } from '../firebase/communityCatches';
import { CommunityCatchPost } from '../types';
import { useAuth } from '../hooks';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const CommunityPage: React.FC = () => {
  const { getUserDisplayName } = useAuth();
  const [posts, setPosts] = useState<CommunityCatchPost[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [species, setSpecies] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [location, setLocation] = useState('');
  const [catchDate, setCatchDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => CommunityCatchesService.subscribeToPosts(setPosts), []);

  const canSubmit = useMemo(() => species.trim().length > 1 && location.trim().length > 1 && catchDate.length > 0, [species, location, catchDate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      setIsSaving(true);
      await CommunityCatchesService.addPost({ userName: getUserDisplayName() || 'צולל/ת', species: species.trim(), weightKg: weightKg ? Number(weightKg) : undefined, location: location.trim(), catchDate, notes: notes.trim() });
      setSpecies(''); setWeightKg(''); setLocation(''); setNotes(''); setCatchDate(new Date().toISOString().slice(0, 10));
    } finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <section className="rounded-3xl bg-gradient-to-r from-[#07294a] to-[#115f7d] p-6 text-white">
          <h1 className="font-display text-4xl">קהילה</h1>
          <p className="mt-2 max-w-2xl text-cyan-100">מפגשים, צלילות מקומיות, תיאום בוואטסאפ ולמידה משותפת מכל יציאה לים.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-800"><FaUsers className="text-cyan-700"/>פעילויות קרובות</h2>
            <ul className="space-y-2 text-sm text-slate-600"><li>מפגש ציפה בזריחה · שישי</li><li>תדריך דיג אחראי · שני</li><li>התאמת בני זוג בוואטסאפ · פתוח כל יום</li></ul>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">שיתוף תפיסה</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input label="סוג דג" value={species} onChange={(e) => setSpecies(e.target.value)} required icon={<FaFish size={14} />} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="משקל (קג)" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} type="number" min="0" step="0.1" icon={<FaWeight size={14} />} />
                <Input label="תאריך תפיסה" value={catchDate} onChange={(e) => setCatchDate(e.target.value)} type="date" required />
              </div>
              <Input label="מיקום" value={location} onChange={(e) => setLocation(e.target.value)} required icon={<FaMapMarkerAlt size={14} />} />
              <textarea className="input w-full min-h-[96px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="תנאי ים, תובנות ולמידה לקהילה" />
              <Button type="submit" loading={isSaving} disabled={!canSubmit} fullWidth>פרסום תפיסה</Button>
            </form>
          </Card>
        </section>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">פוסטים אחרונים מהקהילה</h2>
          <div className="space-y-3">
            {posts.length === 0 && <p className="text-sm text-gray-500">אין עדיין פוסטים. היו הראשונים לשתף.</p>}
            {posts.map((post) => (
              <article key={post.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-800">{post.species}</h3><span className="text-xs text-gray-500">{post.catchDate}</span></div>
                <div className="text-sm text-gray-700 flex items-center gap-2"><FaUser className="text-gray-400" size={12} /> {post.userName}</div>
                <div className="text-sm text-gray-700">📍 {post.location}</div>
                {typeof post.weightKg === 'number' && <div className="text-sm text-gray-700">⚖️ {post.weightKg} קג</div>}
                {post.notes && <p className="text-sm text-gray-600">{post.notes}</p>}
              </article>
            ))}
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CommunityPage;
