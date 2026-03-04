import React from 'react';
import { FaAnchor, FaHandsHelping, FaShieldAlt, FaUsers } from 'react-icons/fa';
import MarketingNav from '../components/Layout/MarketingNav';
import SiteFooter from '../components/Layout/SiteFooter';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06213f] via-[#0a2c4d] to-[#f8f8f3] text-slate-900">
      <MarketingNav />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="rounded-3xl bg-white/95 p-6 shadow-xl">
          <h1 className="font-display text-4xl text-slate-900">הסיפור שלנו</h1>
          <p className="mt-3 text-slate-600">הקמנו את אורקה כקהילת חוף קרובה לצוללים שאכפת להם ממיומנות, בטיחות ושמירה על הים.</p>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          {[{icon:FaShieldAlt,title:'המשימה',body:'להכשיר צוללים בטוחים ודייגים אחראיים בים.'},{icon:FaAnchor,title:'ערכים',body:'כבוד לים, אימון ממושמע וקבלת החלטות רגועה.'},{icon:FaUsers,title:'מדריכים',body:'מאמני צלילה חופשית ומדריכים מקומיים מוסמכי חילוץ.'},{icon:FaHandsHelping,title:'קהילה',body:'מפגשי ים פתוח, ליווי אישי ותרבות בטיחות עם בן זוג.'}].map((item)=>{
            const Icon=item.icon;
            return <article key={item.title} className="rounded-2xl bg-white p-5 shadow">
              <Icon className="text-cyan-700" />
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.body}</p>
            </article>
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
