import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children }) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Fond sombre */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose}/>

            {/* Fenêtre */}
            <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl mx-4">
                {/* Header du modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={22} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Modal;