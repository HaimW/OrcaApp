import React, { useState } from 'react';
import { FaWhatsapp, FaUsers, FaTimes } from 'react-icons/fa';
import { DiveEntry } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { buildIndividualWhatsappUrl } from '../../utils/whatsapp';

interface WhatsAppShareProps {
  entry: DiveEntry;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppShare: React.FC<WhatsAppShareProps> = ({
  entry,
  isOpen,
  onClose,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [groupInviteLink, setGroupInviteLink] = useState(
    localStorage.getItem('orca-community-whatsapp') || ''
  );
  const [shareOption, setShareOption] = useState<'individual' | 'group'>('individual');

  if (!isOpen) return null;

  const formatDiveMessage = () => {
    const catches = entry.catches.length > 0 
      ? `\n🐟 דגים שנתפסו: ${entry.catches.map(c => `${c.species} (${c.weight}ק"ג)`).join(', ')}`
      : '\n🐟 לא נתפסו דגים הפעם';

    const weather = entry.weather 
      ? `\n🌤️ מזג אוויר: ${entry.weather.condition}, טמפ' מים: ${entry.weather.waterTemperature}°C`
      : '';

    return `🌊 *יומן צלילה חדש באורקה!* 🐋

📍 *מיקום:* ${entry.location}
📅 *תאריך:* ${new Date(entry.date).toLocaleDateString('he-IL')}
⏰ *זמן:* ${entry.time}
🌊 *עומק:* ${entry.depth} מטר
⏱️ *משך זמן:* ${entry.duration} דקות${catches}${weather}

📝 *הערות:* ${entry.notes || 'אין הערות מיוחדות'}

${entry.equipment.length > 0 ? `\n🎣 *ציוד:* ${entry.equipment.join(', ')}` : ''}

---
📱 נשלח מאפליקציית אורקה - יומן הצלילה המתקדם
https://haimw.github.io/OrcaApp/`;
  };

  const handleShareToIndividual = () => {
    if (!phoneNumber.trim()) {
      alert('אנא הכניסו מספר טלפון');
      return;
    }

    const message = formatDiveMessage();
    const whatsappUrl = buildIndividualWhatsappUrl(phoneNumber, message);
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleShareToGroup = () => {
    const message = formatDiveMessage();
    
    if (groupInviteLink.trim()) {
      // Extract group ID from WhatsApp group invite link
      const groupMatch = groupInviteLink.match(/chat.whatsapp.com\/([A-Za-z0-9]+)/);
      if (groupMatch) {
        const whatsappUrl = `https://chat.whatsapp.com/${groupMatch[1]}`;
        window.open(whatsappUrl, '_blank');
        // Note: WhatsApp Web doesn't support pre-filled text for groups
        navigator.clipboard.writeText(message);
        alert('הקישור לקבוצה נפתח והודעה הועתקה ללוח. הדביקו אותה בקבוצה!');
      } else {
        alert('קישור הקבוצה לא תקין');
        return;
      }
    } else {
      // General WhatsApp share
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500 text-xl" />
            <h3 className="text-lg font-semibold">שיתוף לקהילת אורקה</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Share options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              בחרו דרך שיתוף:
            </label>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shareOption"
                  value="individual"
                  checked={shareOption === 'individual'}
                  onChange={(e) => setShareOption(e.target.value as 'individual')}
                  className="text-green-500"
                />
                <span>שיתוף לחבר ספציפי</span>
              </label>
              
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shareOption"
                  value="group"
                  checked={shareOption === 'group'}
                  onChange={(e) => setShareOption(e.target.value as 'group')}
                  className="text-green-500"
                />
                <FaUsers className="text-gray-500" />
                <span>שיתוף לקבוצת אורקה</span>
              </label>
            </div>
          </div>

          {/* Individual share */}
          {shareOption === 'individual' && (
            <div className="space-y-3">
              <Input
                label="מספר טלפון (ללא 972+)"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="050-1234567"
                dir="ltr"
              />
              <p className="text-xs text-gray-500">
                הכניסו מספר טלפון ישראלי (ללא קידומת +972)
              </p>
            </div>
          )}

          {/* Group share */}
          {shareOption === 'group' && (
            <div className="space-y-3">
              <Input
                label="קישור לקבוצת WhatsApp (אופציונלי)"
                type="url"
                value={groupInviteLink}
                onChange={(e) => setGroupInviteLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                dir="ltr"
              />
              <p className="text-xs text-gray-500">
                אם אין קישור, תיפתח אפליקציית WhatsApp לבחירת קבוצה
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תצוגה מקדימה של ההודעה:
            </label>
            <div className="text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
              {formatDiveMessage()}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              ביטול
            </Button>
            <Button
              variant="primary"
              onClick={shareOption === 'individual' ? handleShareToIndividual : handleShareToGroup}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <FaWhatsapp className="mr-2" />
              שיתוף
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppShare;
