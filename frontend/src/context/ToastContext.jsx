import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

let idCounter = 0;

const typeStyles = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-danger/30 bg-danger/10 text-danger",
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`w-72 cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md animate-[toast-in_0.25s_ease-out] ${typeStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++idCounter;

      setToasts((previous) => [...previous, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};