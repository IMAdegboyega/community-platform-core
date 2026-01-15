import { X } from "lucide-react";;

export const PostOptionsModal = ({ isOpen, onClose, onEdit, onDelete, onMakeProfilePicture, position }) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit && onEdit();
    onClose();
  };

  const handleMakeProfilePicture = () => {
    onMakeProfilePicture && onMakeProfilePicture();
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed bg-white rounded-lg py-1 z-50 w-1/6 min-w-[100px]"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
          transform: 'translateX(-50%)' // Center it relative to position
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Options */}
        <div className="pt-4 pb-1">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Edit Post
          </button>
          <button
            onClick={handleMakeProfilePicture}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Make Profile Picture
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Delete Post
          </button>
        </div>
      </div>
    </>
  );
};

export const FollowersPopup = ({ isOpen, onClose, onBlock, onReport, position }) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit && onEdit();
    onClose();
  };

  const handleMakeProfilePicture = () => {
    onMakeProfilePicture && onMakeProfilePicture();
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed bg-white shadow-md rounded-lg py-1 z-50 w-1/6 min-w-[100px]"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
          transform: 'translateX(-50%)' // Center it relative to position
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Options */}
        <div className="pt-4 pb-1">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Block
          </button>
          <button
            onClick={handleMakeProfilePicture}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Report
          </button>
        </div>
      </div>
    </>
  );
};

export const FollowingPopup = ({ isOpen, onClose, onBlock, onReport, position }) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit && onEdit();
    onClose();
  };

  const handleMakeProfilePicture = () => {
    onMakeProfilePicture && onMakeProfilePicture();
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed bg-white shadow-md rounded-lg py-1 z-50 w-1/6 min-w-[100px]"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
          transform: 'translateX(-50%)' // Center it relative to position
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Options */}
        <div className="pt-4 pb-1">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Unfollow
          </button>
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Block
          </button>
          <button
            onClick={handleMakeProfilePicture}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Report
          </button>
        </div>
      </div>
    </>
  );
};

export const SubscribersPopup = ({ isOpen, onClose, onBlock, onReport, position }) => {
    

  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit && onEdit();
    onClose();
  };

  const handleMakeProfilePicture = () => {
    onMakeProfilePicture && onMakeProfilePicture();
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed bg-white shadow-md rounded-lg py-1 z-50 w-1/6 min-w-[100px]"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
          transform: 'translateX(-50%)' // Center it relative to position
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Options */}
        <div className="pt-4 pb-1">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Block
          </button>
          <button
            onClick={handleMakeProfilePicture}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Report
          </button>
        </div>
      </div>
    </>
  );
};