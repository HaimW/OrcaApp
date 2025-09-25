import React, { useState, useEffect } from 'react';
import { getRandomOrcaImage, getNewOrcaImage, orcaImages } from '../../utils/orcaImages';

interface OrcaImageProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'square' | 'circle' | 'rounded';
  showCredits?: boolean;
  className?: string;
  specificImage?: string;
  changeOnMount?: boolean;
}

export const OrcaImage: React.FC<OrcaImageProps> = ({
  size = 'md',
  shape = 'rounded',
  showCredits = false,
  className = '',
  specificImage,
  changeOnMount = true
}) => {
  const [currentImage, setCurrentImage] = useState(() => {
    if (specificImage) {
      return orcaImages.find(img => img.id === specificImage) || getRandomOrcaImage();
    }
    return getRandomOrcaImage();
  });

  useEffect(() => {
    if (changeOnMount && !specificImage) {
      setCurrentImage(getRandomOrcaImage());
    }
  }, [changeOnMount, specificImage]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const shapeClasses = {
    square: '',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const handleImageClick = () => {
    if (!specificImage) {
      setCurrentImage(prev => getNewOrcaImage(prev.id));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={currentImage.url}
        alt={currentImage.alt}
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]}
          object-cover 
          cursor-pointer 
          transition-transform 
          hover:scale-105 
          active:scale-95
        `}
        onClick={handleImageClick}
        title={currentImage.description}
        loading="lazy"
        onError={(e) => {
          // Fallback to emoji if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      
      {/* Fallback emoji */}
      <div 
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]}
          bg-gradient-to-br from-blue-400 to-blue-600
          flex items-center justify-center text-white text-2xl
          cursor-pointer transition-transform hover:scale-105 active:scale-95
          hidden
        `}
        onClick={handleImageClick}
        title="🐋 אורקה"
      >
        🐋
      </div>

      {/* Credits */}
      {showCredits && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-b-lg">
          Getty Images
        </div>
      )}
    </div>
  );
};

export default OrcaImage;
