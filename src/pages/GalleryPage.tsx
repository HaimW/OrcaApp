import React from 'react';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const tiles = ['אימון פרידייבינג', 'דייג תת־ימי בים פתוח', 'תדריך סירה לפני יציאה', 'מפגש קהילה על החוף', 'תרגילי בטיחות וחילוץ', 'חקירת ריף ואלמוגים'];

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl text-slate-900">גלריה</h1>
        <p className="mt-2 text-slate-600">צלילות, אימונים ורגעים מהקהילה.</p>
        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {tiles.map((label, idx) => (
            <article key={label} className="group relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 p-4 text-white">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(125,211,252,.7),transparent_60%)]" />
              <p className="relative text-sm">{label}</p>
              <span className="relative mt-16 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">אלבום {idx + 1}</span>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default GalleryPage;
