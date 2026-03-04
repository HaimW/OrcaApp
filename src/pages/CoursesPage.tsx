import React from 'react';
import { FaCertificate, FaFish, FaHeartbeat, FaWater } from 'react-icons/fa';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const CoursesPage: React.FC = () => {
  return (
    <div className="marketing-ltr min-h-screen bg-gradient-to-b from-[#041b34] via-[#083359] to-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl text-white">Courses & Programs</h1>
        <p className="mt-2 max-w-2xl text-cyan-100">Freediving, spearfishing, and safety modules for every level.</p>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[{title:'Beginner',icon:FaWater,price:'From $290',size:'6-8 divers',focus:'Breathing, equalization, buddy basics'},{title:'Intermediate',icon:FaFish,price:'From $390',size:'4-6 divers',focus:'Depth adaptation and hunting control'},{title:'Advanced + Rescue',icon:FaHeartbeat,price:'From $520',size:'4 divers',focus:'Blackout prevention, rescue drills'}].map((course)=>{
            const Icon=course.icon;
            return <article key={course.title} className="rounded-2xl bg-white p-5 shadow-lg">
              <Icon className="text-cyan-700" />
              <h2 className="mt-2 text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-slate-600">{course.focus}</p>
              <p className="mt-3 text-sm"><strong>{course.size}</strong></p>
              <p className="text-amber-600 font-semibold">{course.price}</p>
            </article>
          })}
        </section>
        <section className="mt-8 rounded-2xl bg-white p-6">
          <h3 className="flex items-center gap-2 text-xl font-semibold"><FaCertificate className="text-cyan-700" />Illustrated pathways</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            <li>The freediver's journey: beginner → intermediate → advanced.</li>
            <li>The responsible spearfisher: safety, ethics, and environment loop.</li>
            <li>Coastal conditions map: wind, swell, and visibility awareness.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CoursesPage;
