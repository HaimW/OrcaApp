import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addDiveEntry, updateDiveEntry } from '../store/slices/diveEntriesSlice';
import Header from '../components/Layout/Header';
import DiveEntryForm from '../components/Forms/DiveEntryForm';
import { DiveEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const AddEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { diveEntries } = useAppSelector((state) => state.diveEntries);
  
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

  const handleSubmit = (data: Partial<DiveEntry>) => {
    const entry: DiveEntry = {
      id: isEditing ? id! : uuidv4(),
      ...data as DiveEntry,
      createdAt: isEditing ? existingEntry!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      dispatch(updateDiveEntry(entry));
    } else {
      dispatch(addDiveEntry(entry));
    }

    navigate('/entries');
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


