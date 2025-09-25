import React, { useState } from 'react';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import { Catch, FishingMethod } from '../../../types';
import { FaFish, FaPlus, FaTimes, FaWeight, FaRuler } from 'react-icons/fa';
import { FISHING_METHODS, COMMON_FISH_SPECIES } from '../../../utils/constants';
import { v4 as uuidv4 } from 'uuid';

interface CatchesSectionProps {
  catches: Catch[];
  fishingType: string;
  onFishingTypeChange: (type: string) => void;
  onAddCatch: (catch: Catch) => void;
  onRemoveCatch: (catchId: string) => void;
}

const CatchesSection: React.FC<CatchesSectionProps> = ({
  catches,
  fishingType,
  onFishingTypeChange,
  onAddCatch,
  onRemoveCatch,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatch, setNewCatch] = useState<Partial<Catch>>({
    species: '',
    weight: undefined,
    length: undefined,
    quantity: 1,
    method: fishingType as any,
    released: false,
    notes: '',
  });

  const resetForm = () => {
    setNewCatch({
      species: '',
      weight: undefined,
      length: undefined,
      quantity: 1,
      method: fishingType as any,
      released: false,
      notes: '',
    });
    setShowAddForm(false);
  };

  const handleAddCatch = () => {
    if (newCatch.species?.trim()) {
      const catchToAdd: Catch = {
        id: uuidv4(),
        species: newCatch.species,
        weight: newCatch.weight,
        length: newCatch.length,
        quantity: newCatch.quantity || 1,
        method: (newCatch.method || fishingType) as any,
        released: newCatch.released || false,
        notes: newCatch.notes,
      };
      
      onAddCatch(catchToAdd);
      resetForm();
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaFish className="text-coral-500" />
        דיג ותוצאות
      </h3>

      <div className="space-y-4">
        {/* Fishing Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שיטת דיג
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FISHING_METHODS.map((method) => {
              const isSelected = fishingType === method.type;
              
              return (
                <button
                  key={method.type}
                  type="button"
                  onClick={() => onFishingTypeChange(method.type)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    isSelected
                      ? 'border-ocean-500 bg-ocean-50 text-ocean-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    isSelected ? 'text-ocean-700' : 'text-gray-700'
                  }`}>
                    {method.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Catches */}
        {catches.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">דגים שנתפסו:</h4>
            {catches.map((catch_) => (
              <div key={catch_.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {catch_.species}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({catch_.quantity} יח')
                      </span>
                      {catch_.released && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          שוחרר
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {catch_.weight && `${catch_.weight}ג • `}
                      {catch_.length && `${catch_.length}ס״מ • `}
                      {FISHING_METHODS.find(m => m.type === catch_.method)?.label}
                    </div>
                    
                    {catch_.notes && (
                      <div className="text-sm text-gray-500 mt-1">
                        {catch_.notes}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCatch(catch_.id)}
                    className="text-coral-500 hover:text-coral-600"
                  >
                    <FaTimes size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Catch Form */}
        {showAddForm ? (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג דג
              </label>
              <input
                list="fish-species"
                className="input"
                value={newCatch.species || ''}
                onChange={(e) => setNewCatch({ ...newCatch, species: e.target.value })}
                placeholder="בחרו דג או הקלידו..."
              />
              <datalist id="fish-species">
                {COMMON_FISH_SPECIES.map((species) => (
                  <option key={species} value={species} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="משקל (גרם)"
                type="number"
                min="0"
                value={newCatch.weight || ''}
                onChange={(e) => setNewCatch({ 
                  ...newCatch, 
                  weight: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                icon={<FaWeight />}
                fullWidth={false}
              />
              
              <Input
                label="אורך (ס״מ)"
                type="number"
                min="0"
                value={newCatch.length || ''}
                onChange={(e) => setNewCatch({ 
                  ...newCatch, 
                  length: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                icon={<FaRuler />}
                fullWidth={false}
              />
              
              <Input
                label="כמות"
                type="number"
                min="1"
                value={newCatch.quantity || 1}
                onChange={(e) => setNewCatch({ 
                  ...newCatch, 
                  quantity: parseInt(e.target.value) || 1 
                })}
                fullWidth={false}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newCatch.released || false}
                  onChange={(e) => setNewCatch({ ...newCatch, released: e.target.checked })}
                  className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                />
                <span className="text-sm text-gray-700">דג שוחרר</span>
              </label>
            </div>

            <Input
              label="הערות (אופציונלי)"
              value={newCatch.notes || ''}
              onChange={(e) => setNewCatch({ ...newCatch, notes: e.target.value })}
              placeholder="הערות על הדג..."
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleAddCatch}
                disabled={!newCatch.species?.trim()}
              >
                <FaPlus size={14} />
                הוספת דג
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                ביטול
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setShowAddForm(true)}
            className="h-12 border-2 border-dashed border-gray-300 hover:border-ocean-300"
          >
            <FaPlus size={16} />
            הוספת דג
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CatchesSection;


