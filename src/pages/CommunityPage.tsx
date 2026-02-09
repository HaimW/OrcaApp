import React, { useEffect, useMemo, useState } from 'react';
import { FaFish, FaMapMarkerAlt, FaWeight, FaUser } from 'react-icons/fa';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { CommunityCatchesService } from '../firebase/communityCatches';
import { CommunityCatchPost } from '../types';
import { useAuth } from '../hooks';

const CommunityPage: React.FC = () => {
  const { getUserDisplayName } = useAuth();
  const [posts, setPosts] = useState<CommunityCatchPost[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [species, setSpecies] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [location, setLocation] = useState('');
  const [catchDate, setCatchDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    return CommunityCatchesService.subscribeToPosts(setPosts);
  }, []);

  const canSubmit = useMemo(() => {
    return species.trim().length > 1 && location.trim().length > 1 && catchDate.length > 0;
  }, [species, location, catchDate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      setIsSaving(true);
      await CommunityCatchesService.addPost({
        userName: getUserDisplayName() || 'Spearo',
        species: species.trim(),
        weightKg: weightKg ? Number(weightKg) : undefined,
        location: location.trim(),
        catchDate,
        notes: notes.trim(),
      });

      setSpecies('');
      setWeightKg('');
      setLocation('');
      setNotes('');
      setCatchDate(new Date().toISOString().slice(0, 10));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="Community Catches" />

      <div className="p-4 space-y-4">
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Post a Catch</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input
              label="Fish species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g. Amberjack"
              required
              icon={<FaFish size={14} />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Weight (kg)"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Optional"
                type="number"
                min="0"
                step="0.1"
                icon={<FaWeight size={14} />}
              />
              <Input
                label="Catch date"
                value={catchDate}
                onChange={(e) => setCatchDate(e.target.value)}
                type="date"
                required
              />
            </div>
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. North reef"
              required
              icon={<FaMapMarkerAlt size={14} />}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                className="input w-full min-h-[96px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gear, conditions, and anything useful for the community"
              />
            </div>
            <Button type="submit" loading={isSaving} disabled={!canSubmit} fullWidth>
              Publish catch
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Community Posts</h2>
          <div className="space-y-3">
            {posts.length === 0 && <p className="text-sm text-gray-500">No posts yet. Be first to share.</p>}
            {posts.map((post) => (
              <article key={post.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{post.species}</h3>
                  <span className="text-xs text-gray-500">{post.catchDate}</span>
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <FaUser className="text-gray-400" size={12} /> {post.userName}
                </div>
                <div className="text-sm text-gray-700">📍 {post.location}</div>
                {typeof post.weightKg === 'number' && <div className="text-sm text-gray-700">⚖️ {post.weightKg} kg</div>}
                {post.notes && <p className="text-sm text-gray-600">{post.notes}</p>}
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityPage;
