import React from 'react';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl text-slate-900">צור קשר והרשמה</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <form className="space-y-3 rounded-2xl bg-white p-6 shadow">
            <input className="input" placeholder="שם מלא" />
            <input className="input" type="email" placeholder="דוא״ל" />
            <input className="input" placeholder="מספר וואטסאפ" />
            <select className="input"><option>בחרו קורס</option><option>מתחילים</option><option>ביניים</option><option>מתקדמים</option></select>
            <textarea className="input min-h-[120px]" placeholder="ספרו לנו על הרקע והיעדים שלכם" />
            <button className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-slate-900 hover:bg-amber-400">בקשת שיחת הרשמה</button>
          </form>
          <aside className="rounded-2xl bg-[#041b34] p-6 text-cyan-50 shadow">
            <h2 className="text-2xl font-semibold">צוללים באחריות</h2>
            <p className="mt-2 text-sm text-cyan-100">אזור פעילות: חיפה, הרצליה, אילת ויציאות עונתיות בסירה.</p>
            <p className="mt-2 text-sm">קבוצת וואטסאפ: wa.me/972500000000</p>
            <p className="text-sm">דוא״ל: hello@orcasdive.com</p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
