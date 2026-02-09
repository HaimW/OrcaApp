import { DiveEntry } from '../types';

const getDiveSummaryMessage = (entry: DiveEntry): string => {
  const catchesSummary = entry.catches.length > 0
    ? entry.catches
      .map((fish) => `• ${fish.species}${fish.weight ? ` (${fish.weight} ק"ג)` : ''}`)
      .join('\n')
    : '• לא נתפסו דגים הפעם';

  return [
    '🌊🐋 *דיווח צלילה חדש מאורקה* 🐟🤿',
    '',
    `📍 *מיקום:* ${entry.location}`,
    `📅 *תאריך:* ${new Date(entry.date).toLocaleDateString('he-IL')}`,
    `⏰ *שעה:* ${entry.time}`,
    `🌊 *עומק:* ${entry.depth} מטר`,
    `⏱️ *משך:* ${entry.duration} דקות`,
    `👀 *ראות:* ${entry.visibility} מטר`,
    `🌡️ *מים:* ${entry.weather.waterTemperature}°C`,
    '',
    '🎣 *שלל:*',
    catchesSummary,
    '',
    `📝 *הערות:* ${entry.notes?.trim() || 'אין הערות מיוחדות'}`,
    '',
    '📸 מצורפת תמונת הצלילה 👇',
  ].join('\n');
};

const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
};

export const shareDiveEntryToWhatsappGroup = async (entry: DiveEntry): Promise<void> => {
  const message = getDiveSummaryMessage(entry);
  const groupInviteLink = localStorage.getItem('orca-community-whatsapp') || '';

  const primaryPhoto = entry.photos?.[0];
  const canShareFile = typeof navigator !== 'undefined' && !!navigator.share && !!primaryPhoto;

  if (canShareFile) {
    try {
      const photoFile = await dataUrlToFile(primaryPhoto, `orca-dive-${entry.id}.jpg`);
      await navigator.share({
        title: `דיווח צלילה - ${entry.location}`,
        text: message,
        files: [photoFile],
      });
      return;
    } catch (error) {
      console.warn('Native share with file failed, fallback to WhatsApp URL', error);
    }
  }

  const hasGroupLink = Boolean(groupInviteLink.trim());
  const whatsappUrl = hasGroupLink
    ? groupInviteLink.trim()
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  if (hasGroupLink && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(message);
      alert('נפתחה קבוצת ה-WhatsApp שהוגדרה בהגדרות. הטקסט הועתק ללוח – הדביקו אותו בקבוצה.');
    } catch (error) {
      console.warn('Could not copy message to clipboard', error);
      alert('נפתחה קבוצת ה-WhatsApp שהוגדרה בהגדרות. העתיקו את הטקסט ידנית מתוך הדיווח.');
    }
  }
};
