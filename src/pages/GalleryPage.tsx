import React from 'react';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const tiles = ['Freedive training', 'Blue-water spearfishing', 'Boat briefing', 'Community BBQ', 'Safety drills', 'Coral reef exploration'];

const GalleryPage: React.FC = () => {
  return (
    <div className="marketing-ltr min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl text-slate-900">Gallery / Portfolio</h1>
        <p className="mt-2 text-slate-600">Dives, trips, and community moments.</p>
        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {tiles.map((label, idx) => (
            <article key={label} className="group relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 p-4 text-white">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(125,211,252,.7),transparent_60%)]" />
              <p className="relative text-sm">{label}</p>
              <span className="relative mt-16 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">Album {idx + 1}</span>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default GalleryPage;
