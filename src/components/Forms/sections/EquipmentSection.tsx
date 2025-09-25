import React, { useState } from 'react';
import Card from '../../UI/Card';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { FaCog, FaWeight, FaPlus, FaTimes } from 'react-icons/fa';
import { EQUIPMENT_TYPES } from '../../../utils/constants';

interface EquipmentSectionProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [newGearItem, setNewGearItem] = useState('');

  const addGearItem = () => {
    if (newGearItem.trim()) {
      const currentGear = data.gear || [];
      onUpdate('gear', [...currentGear, newGearItem.trim()]);
      setNewGearItem('');
    }
  };

  const removeGearItem = (index: number) => {
    const currentGear = data.gear || [];
    onUpdate('gear', currentGear.filter((_: any, i: number) => i !== index));
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaCog className="text-gray-600" />
        ציוד צלילה
      </h3>

      <div className="space-y-4">
        {/* Mask */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מסכה
          </label>
          <div className="relative">
            <input
              list="masks"
              className="input"
              value={data.mask || ''}
              onChange={(e) => onUpdate('mask', e.target.value)}
              placeholder="בחרו מסכה או הקלידו..."
            />
            <datalist id="masks">
              {EQUIPMENT_TYPES.masks.map((mask) => (
                <option key={mask} value={mask} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Fins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סנפירים
          </label>
          <div className="relative">
            <input
              list="fins"
              className="input"
              value={data.fins || ''}
              onChange={(e) => onUpdate('fins', e.target.value)}
              placeholder="בחרו סנפירים או הקלידו..."
            />
            <datalist id="fins">
              {EQUIPMENT_TYPES.fins.map((fin) => (
                <option key={fin} value={fin} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Suit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            חליפה
          </label>
          <div className="relative">
            <input
              list="suits"
              className="input"
              value={data.suit || ''}
              onChange={(e) => onUpdate('suit', e.target.value)}
              placeholder="בחרו חליפה או הקלידו..."
            />
            <datalist id="suits">
              {EQUIPMENT_TYPES.suits.map((suit) => (
                <option key={suit} value={suit} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Weight */}
        <Input
          label="משקל (ק&quot;ג)"
          type="number"
          min="0"
          step="0.5"
          value={data.weight || ''}
          onChange={(e) => onUpdate('weight', parseFloat(e.target.value) || 0)}
          icon={<FaWeight />}
        />

        {/* Additional Gear */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ציוד נוסף
          </label>
          
          {/* Current gear items */}
          {data.gear && data.gear.length > 0 && (
            <div className="mb-3 space-y-2">
              {data.gear.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGearItem(index)}
                    className="text-coral-500 hover:text-coral-600 p-1"
                  >
                    <FaTimes size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add new gear item */}
          <div className="flex gap-2">
            <Input
              fullWidth
              placeholder="הוסיפו ציוד נוסף..."
              value={newGearItem}
              onChange={(e) => setNewGearItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGearItem())}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addGearItem}
              disabled={!newGearItem.trim()}
              className="px-3"
            >
              <FaPlus size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EquipmentSection;


