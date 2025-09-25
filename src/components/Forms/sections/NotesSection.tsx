import React from 'react';
import Card from '../../UI/Card';
import { FaStickyNote, FaStar } from 'react-icons/fa';

interface NotesSectionProps {
  notes: string;
  rating: number;
  onNotesChange: (notes: string) => void;
  onRatingChange: (rating: number) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  rating,
  onNotesChange,
  onRatingChange,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaStickyNote className="text-yellow-500" />
        הערות ודירוג
      </h3>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            דירוג הצלילה
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className={`p-1 rounded transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <FaStar size={24} />
              </button>
            ))}
            <span className="mr-2 text-sm text-gray-600">
              ({rating} מתוך 5)
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הערות כלליות
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="ספרו על הצלילה... מה ראיתם? איך הרגשתם? מה ייחד את הצלילה הזו?"
            className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1 text-left">
            {notes.length}/500 תווים
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotesSection;


