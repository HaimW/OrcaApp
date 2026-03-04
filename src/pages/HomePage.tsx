import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFish, FaHandsHelping, FaLifeRing, FaPlus, FaRoute, FaWater } from 'react-icons/fa';
import { useAuth, useDiveEntries } from '../hooks';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { diveEntries } = useDiveEntries();
  const { getUserDisplayName, isAnonymous } = useAuth();

  return (
    <div className="marketing-ltr min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031a33] via-[#0a365c] to-[#0c5678] px-4 py-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,.3),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,.18),transparent_42%)]" />
          <div className="mx-auto max-w-6xl">
            <p className="text-cyan-200">Trusted. Local. Ocean-first.</p>
            <h1 className="font-display mt-2 max-w-3xl text-4xl leading-tight md:text-6xl">Freediving & Spearfishing Community built around safety.</h1>
            <p className="mt-4 max-w-2xl text-slate-100">Modern training, responsible hunting ethics, and a connected dive log system for every member.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => navigate('/contact')} className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900">Join Orca's</button>
              <button onClick={() => navigate('/add')} className="rounded-xl border border-cyan-200/50 bg-white/10 px-5 py-3">Log a dive</button>
            </div>
            <p className="mt-4 text-sm text-cyan-100">{isAnonymous ? 'Guest mode active' : `Welcome back, ${getUserDisplayName()}`} · {diveEntries.length} logged dives</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
          {[{ icon: FaWater, title: 'Freediving', body: 'Breathing, equalization, depth confidence.' }, { icon: FaFish, title: 'Spearfishing', body: 'Ethical hunting, species knowledge, legal limits.' }, { icon: FaLifeRing, title: 'Safety', body: 'Buddy protocol, rescue drills, calm decision making.' }].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <Icon className="text-cyan-700" />
                <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                <p className="text-sm text-slate-600">{item.body}</p>
              </article>
            );
          })}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl bg-slate-900 p-7 text-slate-100">
            <h3 className="font-display text-2xl">Illustrated Guides</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-800 p-4"><FaRoute className="text-cyan-300" /> The freediver's journey</div>
              <div className="rounded-xl bg-slate-800 p-4"><FaHandsHelping className="text-cyan-300" /> Responsible spearfisher cycle</div>
              <div className="rounded-xl bg-slate-800 p-4"><FaPlus className="text-cyan-300" /> Daily ocean condition playbook</div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
