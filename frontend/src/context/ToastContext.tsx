import { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — fixed bottom center on mobile, bottom right on desktop */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-[100] flex flex-col gap-2 pointer-events-none w-[90%] sm:w-auto max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-sm animate-toast-in ${
              toast.type === 'success'
                ? 'bg-[#1C1814]/95 border-brand/30'
                : 'bg-[#1C1814]/95 border-red-500/30'
            }`}
          >
            <span
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                toast.type === 'success' ? 'bg-brand/15 text-brand' : 'bg-red-500/15 text-red-400'
              }`}
            >
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <p className="text-white text-sm font-medium leading-snug">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};