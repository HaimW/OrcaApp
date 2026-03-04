import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-700 bg-[#051327] text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <h4 className="font-display text-lg text-white">קהילת הצלילה של אורקה</h4>
          <p className="mt-2 text-sm text-slate-300">
            צלילה חופשית ודיג אחראי בגישה מקצועית ובטיחות מעל הכול.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-white">מידע מהיר</h5>
          <ul className="mt-2 space-y-1 text-sm">
            <li>אזור פעילות: חופי הים התיכון ואילת</li>
            <li>גודל קבוצה: 4-8 צוללים</li>
            <li>וואטסאפ: +972-50-000-0000</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-white">עקבו אחרינו</h5>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Instagram /orcadive</li>
            <li>Facebook Orca Freedive Club</li>
            <li>אימייל hello@orcasdive.com</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
