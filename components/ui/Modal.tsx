interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 md:p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100 shrink-0 bg-white">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-xl cursor-pointer hover:bg-gray-100"
          >
            <i className="bi bi-x-lg text-base"></i>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
