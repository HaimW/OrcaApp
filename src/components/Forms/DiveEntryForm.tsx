import React, { useState } from 'react';
import { DiveEntry, Catch } from '../../types';
import Card from '../UI/Card';
import Button from '../UI/Button';
import BasicInfoSection from './sections/BasicInfoSection';
import WeatherSection from './sections/WeatherSection';
import EquipmentSection from './sections/EquipmentSection';
import CatchesSection from './sections/CatchesSection';
import PhotosSection from './sections/PhotosSection';
import NotesSection from './sections/NotesSection';
import { FaSave, FaTimes, FaWhatsapp } from 'react-icons/fa';

interface DiveEntryFormProps {
  initialData: Partial<DiveEntry>;
  onSubmit: (data: Partial<DiveEntry>, options?: { shareToWhatsapp: boolean }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const DiveEntryForm: React.FC<DiveEntryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<DiveEntry>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shareToWhatsapp, setShareToWhatsapp] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof DiveEntry],
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'תאריך נדרש';
    }

    if (!formData.time) {
      newErrors.time = 'שעה נדרשת';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'מיקום נדרש';
    }

    if (!formData.depth || formData.depth <= 0) {
      newErrors.depth = 'עומק חייב להיות גדול מ-0';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'משך הצלילה חייב להיות גדול מ-0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, { shareToWhatsapp });
    }
  };

  const addCatch = (catchData: Catch) => {
    const currentCatches = formData.catches || [];
    updateFormData('catches', [...currentCatches, catchData]);
  };

  const removeCatch = (catchId: string) => {
    const currentCatches = formData.catches || [];
    updateFormData('catches', currentCatches.filter(c => c.id !== catchId));
  };

  const addPhoto = (photo: string) => {
    const currentPhotos = formData.photos || [];
    updateFormData('photos', [...currentPhotos, photo]);
  };

  const removePhoto = (index: number) => {
    const currentPhotos = formData.photos || [];
    updateFormData('photos', currentPhotos.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <BasicInfoSection
        data={formData}
        errors={errors}
        onUpdate={updateFormData}
      />

      {/* Weather Conditions */}
      <WeatherSection
        data={formData.weather || {}}
        onUpdate={(field, value) => updateNestedFormData('weather', field, value)}
      />

      {/* Equipment */}
      <EquipmentSection
        data={formData.equipment || {}}
        onUpdate={(field, value) => updateNestedFormData('equipment', field, value)}
      />

      {/* Catches */}
      <CatchesSection
        catches={formData.catches || []}
        fishingType={formData.fishingType || 'speargun'}
        onFishingTypeChange={(type) => updateFormData('fishingType', type)}
        onAddCatch={addCatch}
        onRemoveCatch={removeCatch}
      />

      {/* Photos */}
      <PhotosSection
        photos={formData.photos || []}
        onAddPhoto={addPhoto}
        onRemovePhoto={removePhoto}
      />

      {/* Notes and Rating */}
      <NotesSection
        notes={formData.notes || ''}
        rating={formData.rating || 5}
        onNotesChange={(notes) => updateFormData('notes', notes)}
        onRatingChange={(rating) => updateFormData('rating', rating)}
      />

      {/* Action Buttons */}
      <Card>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="h-12"
            >
              <FaSave size={20} />
              {isEditing ? 'עדכון צלילה' : 'שמירת צלילה'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="h-12 px-6"
            >
              <FaTimes size={20} />
            </Button>
          </div>

          {!isEditing && (
            <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-green-200 bg-green-50 text-green-800 cursor-pointer">
              <input
                type="checkbox"
                checked={shareToWhatsapp}
                onChange={(e) => setShareToWhatsapp(e.target.checked)}
                className="h-4 w-4 accent-green-600"
              />
              <FaWhatsapp size={18} />
              <span className="text-sm font-medium">לשלוח גם דיווח לקבוצת WhatsApp</span>
            </label>
          )}
        </div>
      </Card>
    </form>
  );
};

export default DiveEntryForm;

