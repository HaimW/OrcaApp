import React from 'react';
import Card from './Card';
import Button from './Button';
import { FaExclamationTriangle } from 'react-icons/fa';

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <Card 
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-coral-600" size={32} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">
              {message}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="danger"
              fullWidth
              onClick={onConfirm}
            >
              מחיקה
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={onCancel}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeleteConfirmModal;



