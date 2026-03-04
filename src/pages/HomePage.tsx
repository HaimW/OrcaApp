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
    <div className="min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031a33] via-[#0a365c] to-[#0c5678] px-4 py-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,.3),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,.18),transparent_42%)]" />
          <div className="mx-auto max-w-6xl">
            <p className="text-cyan-200">מקצועיות. קהילה. ים.</p>
            <h1 className="font-display mt-2 max-w-3xl text-4xl leading-tight md:text-6xl">פרידייבינג ודייג תת־ימי קהילתי עם בטיחות מעל הכול.</h1>
            <p className="mt-4 max-w-2xl text-slate-100">הדרכות מודרניות, קהילה פעילה ויומן צלילה מקצועי במקום אחד.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => navigate('/contact')} className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900">להצטרפות</button>
              <button onClick={() => navigate('/entries')} className="rounded-xl border border-cyan-200/50 bg-white/10 px-5 py-3">פתיחת יומן הצלילות</button>
              <button onClick={() => navigate('/add')} className="rounded-xl border border-cyan-200/50 bg-white/10 px-5 py-3">הוספת צלילה חדשה</button>
            </div>
            <p className="mt-4 text-sm text-cyan-100">{isAnonymous ? 'מצב אורח פעיל' : `ברוך הבא ${getUserDisplayName()}`} · {diveEntries.length} צלילות מתועדות</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
          {[{ icon: FaWater, title: 'פרידייבינג', body: 'נשימה, השוואת לחצים ושליטה בעומק.' }, { icon: FaFish, title: 'דייג תת־ימי', body: 'דייג אחראי, היכרות עם המינים ועמידה בחוק.' }, { icon: FaLifeRing, title: 'בטיחות', body: 'פרוטוקול באדי, תרגילי חילוץ וקבלת החלטות רגועה.' }].map((item) => {
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
            <h3 className="font-display text-2xl">המחשות ותוכן מקצועי</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-800 p-4"><FaRoute className="text-cyan-300" /> מסלול התקדמות הצולל: מתחיל עד מתקדם</div>
              <div className="rounded-xl bg-slate-800 p-4"><FaHandsHelping className="text-cyan-300" /> דייג אחראי: בטיחות, אתיקה ושמירה על הסביבה</div>
              <div className="rounded-xl bg-slate-800 p-4"><FaPlus className="text-cyan-300" /> קריאת תנאי ים יומית: רוח, סוואל וראות</div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
