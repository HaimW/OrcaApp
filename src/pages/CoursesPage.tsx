import React from 'react';
import { FaCertificate, FaFish, FaHeartbeat, FaWater } from 'react-icons/fa';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#041b34] via-[#083359] to-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl text-white">קורסים ותכניות</h1>
        <p className="mt-2 max-w-2xl text-cyan-100">פרידייבינג, דייג תת־ימי ומודולי בטיחות לכל רמה.</p>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[{title:'מתחילים',icon:FaWater,price:'החל מ־$290',size:'6–8 צוללים',focus:'נשימה, איזון ולימוד באדי בסיסי'},{title:'ביניים',icon:FaFish,price:'החל מ־$390',size:'4–6 צוללים',focus:'שיפור עומק, טכניקה ושליטה בציד'},{title:'מתקדמים + חילוץ',icon:FaHeartbeat,price:'החל מ־$520',size:'עד 4 צוללים',focus:'מניעת blackout, תגובה וחילוץ'}].map((course)=>{
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
          <h3 className="flex items-center gap-2 text-xl font-semibold"><FaCertificate className="text-cyan-700" />המחשות מרכזיות</h3>
          <ul className="mt-3 list-disc space-y-2 pr-6 text-slate-700">
            <li>מסלול התקדמות הצולל: מתחיל → ביניים → מתקדם.</li>
            <li>הדייג האחראי: בטיחות, אתיקה ושמירה על הסביבה.</li>
            <li>קריאת תנאים: רוח, סוואל, זרם וראות.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CoursesPage;
