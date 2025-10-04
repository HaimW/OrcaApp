import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <LoadingSpinner size="md" text="טוען..." />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Helper function to create lazy components
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <Suspense fallback={<LoadingSpinner size="md" text="טוען..." />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;
