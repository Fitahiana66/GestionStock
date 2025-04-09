import { useCallback } from "react";
import { Dialog } from "@headlessui/react";

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-xs sm:max-w-md rounded-lg bg-white p-4 sm:p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            Confirmation
          </Dialog.Title>
          <Dialog.Description className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {message}
          </Dialog.Description>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              Confirmer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ConfirmationModal;
