import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaCog, FaFish, FaList, FaPlus, FaShieldAlt, FaWhatsapp } from 'react-icons/fa';
import { useUserProfile } from '../hooks/useUserProfile';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isProfileLoading } = useUserProfile();
  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('orca-community-whatsapp') || ''
  );

  if (isProfileLoading) {
    return <div className="p-6 text-center text-gray-500">טוען לוח ניהול...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/entries" replace />;
  }

  const saveWhatsappGroup = () => {
    localStorage.setItem('orca-community-whatsapp', whatsappGroupLink.trim());
    alert('קישור קבוצת WhatsApp נשמר בהצלחה');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mb-1 flex items-center gap-2 text-red-700">
            <FaShieldAlt />
            <h1 className="text-lg font-bold">תפריט מנהל</h1>
          </div>
          <p className="text-sm text-red-600">כלי הניהול חזרו: ניווט מהיר ועריכת הגדרות מערכת.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button onClick={() => navigate('/entries')} className="rounded-xl border bg-white p-4 text-right">
            <FaList className="mb-2 text-cyan-600" />
            <p className="font-semibold">יומן צלילות</p>
          </button>
          <button onClick={() => navigate('/add')} className="rounded-xl border bg-white p-4 text-right">
            <FaPlus className="mb-2 text-cyan-600" />
            <p className="font-semibold">הוספת צלילה</p>
          </button>
          <button onClick={() => navigate('/stats')} className="rounded-xl border bg-white p-4 text-right">
            <FaFish className="mb-2 text-cyan-600" />
            <p className="font-semibold">סטטיסטיקות</p>
          </button>
          <button onClick={() => navigate('/admin')} className="rounded-xl border border-red-300 bg-red-50 p-4 text-right">
            <FaCog className="mb-2 text-red-600" />
            <p className="font-semibold text-red-700">הגדרות מנהל</p>
          </button>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-800">
            <FaWhatsapp className="text-green-600" />
            קבוצת WhatsApp לדיווחים
          </h2>
          <label className="mb-2 block text-sm text-gray-600">קישור הזמנה לקבוצה</label>
          <input
            type="url"
            dir="ltr"
            value={whatsappGroupLink}
            onChange={(e) => setWhatsappGroupLink(e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-gray-500">הקישור הזה ישמש את כל המשתמשים בעת שיתוף דיווח מהצלילה.</p>
          <button
            onClick={saveWhatsappGroup}
            className="mt-3 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            שמירת קישור
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
