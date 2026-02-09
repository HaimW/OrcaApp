import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiveEntries, useAuth } from '../hooks';
import Header from '../components/Layout/Header';
import DiveEntryForm from '../components/Forms/DiveEntryForm';
import { DiveEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { shareDiveEntryToWhatsappGroup } from '../utils/whatsappShare';

const AddEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { diveEntries, addEntry, updateEntry } = useDiveEntries();
  const { user } = useAuth();
  const { id } = useParams();
  
  const isEditing = Boolean(id);
  const existingEntry = isEditing ? diveEntries.find(entry => entry.id === id) : undefined;
  
  const [formData, setFormData] = useState<Partial<DiveEntry>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    depth: 0,
    duration: 0,
    visibility: 0,
    weather: {
      condition: 'sunny',
      temperature: 25,
      waterTemperature: 22,
      windSpeed: 0,
      windDirection: 'צפון',
      waveHeight: 0,
      current: 'none',
    },
    equipment: {
      mask: '',
      fins: '',
      suit: '',
      weight: 0,
      gear: [],
    },
    fishingType: 'speargun',
    catches: [],
    photos: [],
    notes: '',
    rating: 5,
  });

  useEffect(() => {
    if (existingEntry) {
      setFormData(existingEntry);
    }
  }, [existingEntry]);

  const handleSubmit = async (
    data: Partial<DiveEntry>,
    options?: { shareToWhatsapp: boolean }
  ) => {
    const entry: DiveEntry = {
      id: isEditing ? id! : uuidv4(),
      userId: user?.uid || 'anonymous',
      ...data as DiveEntry,
      createdAt: isEditing ? existingEntry!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await updateEntry(entry);
      } else {
        await addEntry(entry);
      }

      if (!isEditing && options?.shareToWhatsapp) {
        const hasGroupLink = Boolean(localStorage.getItem('orca-community-whatsapp')?.trim());

        if (!hasGroupLink) {
          alert('לא הוגדרה קבוצת WhatsApp על ידי מנהל המערכת. תיפתח WhatsApp כללית לשיתוף ידני.');
        }

        await shareDiveEntryToWhatsappGroup(entry);
      }

      navigate('/entries');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('שגיאה בשמירת הצלילה: ' + (error as Error).message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={isEditing ? 'עריכת צלילה' : 'צלילה חדשה'} 
      />
      
      <div className="p-4">
        <DiveEntryForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default AddEntryPage;
