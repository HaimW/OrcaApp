import React, { useRef } from 'react';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { FaCamera, FaPlus, FaTimes, FaImage } from 'react-icons/fa';

interface PhotosSectionProps {
  photos: string[];
  onAddPhoto: (photo: string) => void;
  onRemovePhoto: (index: number) => void;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              onAddPhoto(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaCamera className="text-purple-500" />
        תמונות
      </h3>

      <div className="space-y-4">
        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`תמונה ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onRemovePhoto(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                >
                  <FaTimes size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Photo Button */}
        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={triggerFileSelect}
            className="h-16 border-2 border-dashed border-gray-300 hover:border-ocean-300 flex-col gap-2"
          >
            <FaImage size={24} className="text-gray-400" />
            <span>הוספת תמונות</span>
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            ניתן להוסיף מספר תמונות בבת אחת
          </p>
        </div>

        {/* Photos count */}
        {photos.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            {photos.length} תמונות נוספו
          </div>
        )}
      </div>
    </Card>
  );
};

export default PhotosSection;


