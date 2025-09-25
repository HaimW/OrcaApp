import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const baseClasses = `
    card
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : ''}
    ${className}
  `.trim();

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Card;


