
// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-3 px-5 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
