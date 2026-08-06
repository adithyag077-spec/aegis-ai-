import React, { createContext, useState, useContext, useCallback } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type = 'INFO', message = '', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, message, title };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const typeStyles = {
            CRITICAL: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
            HIGH: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
            MEDIUM: 'bg-yellow-950/90 border-yellow-500/50 text-yellow-200',
            SAFE: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
            INFO: 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
          };
          const style = typeStyles[toast.type] || typeStyles.INFO;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border glass-panel shadow-2xl flex items-start justify-between gap-3 animate-bounce-short ${style}`}
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  {toast.title && <h4 className="text-xs font-bold uppercase font-mono mb-0.5">{toast.title}</h4>}
                  <p className="text-xs leading-relaxed">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
