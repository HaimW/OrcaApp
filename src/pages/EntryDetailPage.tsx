import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { deleteDiveEntry } from '../store/slices/diveEntriesSlice';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import EntryDetails from '../components/Entries/EntryDetails';
import DeleteConfirmModal from '../components/UI/DeleteConfirmModal';
import { 
  FaEdit, 
  FaTrash, 
  FaArrowLeft, 
  FaShare,
  FaExclamationTriangle 
} from 'react-icons/fa';

const EntryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { diveEntries } = useAppSelector((state) => state.diveEntries);
  const { currentUser } = useAppSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const entry = diveEntries.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="צלילה לא נמצאה" />
        <div className="p-4">
          <Card className="text-center py-12">
            <FaExclamationTriangle className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              צלילה לא נמצאה
            </h3>
            <p className="text-gray-500 mb-4">
              הצלילה שחיפשתם אינה קיימת או נמחקה
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/entries')}
            >
              <FaArrowLeft size={16} />
              חזרה ליומן
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/edit/${entry.id}`);
  };

  const handleDelete = () => {
    if (!currentUser) return;
    dispatch(deleteDiveEntry({ entryId: entry.id, userId: currentUser.id }));
    navigate('/entries');
  };

  const handleShare = async () => {
    const shareData = {
      title: `צלילה ב${entry.location}`,
      text: `צלילה מעולה ב${entry.location} - עומק ${entry.depth}מ', ${entry.catches.length} דגים נתפסו`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        // Could show a toast here
        alert('הקישור הועתק ללוח');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`צלילה ב${entry.location}`} />
      
      <div className="p-4 space-y-4">
        {/* Action Buttons */}
        <Card padding="sm">
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleEdit}
              className="flex-1"
            >
              <FaEdit size={16} />
              עריכה
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleShare}
              className="px-4"
            >
              <FaShare size={16} />
            </Button>
            
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="px-4"
            >
              <FaTrash size={16} />
            </Button>
          </div>
        </Card>

        {/* Entry Details */}
        <EntryDetails entry={entry} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="מחיקת צלילה"
          message={`האם אתם בטוחים שברצונכם למחוק את הצלילה ב${entry.location}? פעולה זו לא ניתנת לביטול.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default EntryDetailPage;


