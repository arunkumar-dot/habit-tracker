"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} style={{ color: "var(--accent-success)" }} />,
    error: <XCircle size={16} style={{ color: "var(--accent-danger)" }} />,
    info: <AlertCircle size={16} style={{ color: "var(--accent-primary)" }} />,
  };

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-sm"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        animation: "toastIn 0.2s ease-out",
      }}
    >
      {icons[toast.type]}
      <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
        {toast.message}
      </span>
      <button onClick={onRemove} className="ml-2 p-0.5 rounded" style={{ color: "var(--text-disabled)" }}>
        <X size={14} />
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
