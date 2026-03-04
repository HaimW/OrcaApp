import React from 'react';
import Card from '../../UI/Card';
import Input from '../../UI/Input';
import {
  FaCloudSun,
  FaThermometerHalf,
  FaWind,
  FaWater,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaBolt,
  FaSmog,
} from 'react-icons/fa';
import { WEATHER_CONDITIONS, COMPASS_DIRECTIONS } from '../../../utils/constants';

interface WeatherSectionProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({
  data,
  onUpdate,
}) => {
  const weatherIcons = {
    sunny: FaSun,
    cloudy: FaCloud,
    rainy: FaCloudRain,
    stormy: FaBolt,
    foggy: FaSmog,
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaCloudSun className="text-orange-500" />
        תנאי מזג אוויר
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">מזג אוויר</label>
          <div className="grid grid-cols-5 gap-2">
            {WEATHER_CONDITIONS.map((condition) => {
              const Icon = weatherIcons[condition.condition];
              const isSelected = data.condition === condition.condition;
              return (
                <button
                  key={condition.condition}
                  type="button"
                  onClick={() => onUpdate('condition', condition.condition)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    isSelected ? 'border-ocean-500 bg-ocean-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} className={isSelected ? 'text-ocean-600' : 'text-gray-500'} />
                  <span className={`text-xs ${isSelected ? 'text-ocean-600 font-medium' : 'text-gray-600'}`}>
                    {condition.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="טמפרטורת אוויר (°C)"
            type="number"
            value={data.temperature || ''}
            onChange={(e) => onUpdate('temperature', parseInt(e.target.value) || 0)}
            icon={<FaThermometerHalf />}
          />

          <Input
            label="טמפרטורת מים (°C)"
            type="number"
            value={data.waterTemperature || ''}
            onChange={(e) => onUpdate('waterTemperature', parseInt(e.target.value) || 0)}
            icon={<FaWater />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">רוח - כיוון</label>
            <select
              className="input"
              value={data.windDirection || 'צפון'}
              onChange={(e) => onUpdate('windDirection', e.target.value)}
            >
              {COMPASS_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>{direction}</option>
              ))}
            </select>
          </div>

          <Input
            label="רוח - עוצמה"
            type="number"
            min="0"
            value={data.windIntensity || ''}
            onChange={(e) => onUpdate('windIntensity', parseInt(e.target.value) || 0)}
            icon={<FaWind />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">זרם - כיוון</label>
            <select
              className="input"
              value={data.currentDirection || 'צפון'}
              onChange={(e) => onUpdate('currentDirection', e.target.value)}
            >
              {COMPASS_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>{direction}</option>
              ))}
            </select>
          </div>

          <Input
            label="זרם - עוצמה"
            type="number"
            min="0"
            value={data.currentIntensity || ''}
            onChange={(e) => onUpdate('currentIntensity', parseInt(e.target.value) || 0)}
            icon={<FaWater />}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeatherSection;
