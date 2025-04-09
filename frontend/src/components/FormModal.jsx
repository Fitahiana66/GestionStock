import { useCallback } from "react";
import { Dialog } from "@headlessui/react";

function FormModal({ isOpen, onClose, title, onSubmit, children, hidden = false }) {
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(e);
    },
    [onSubmit]
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-xs sm:max-w-lg rounded-lg bg-white p-4 sm:p-6 shadow-xl">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            {title}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {children}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
              >
                Annuler
              </button>
              {!hidden && (
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default FormModal;
