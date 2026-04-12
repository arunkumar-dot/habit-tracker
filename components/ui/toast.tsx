"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

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
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} style={{ color: "var(--accent-success)", flexShrink: 0 }} />,
    error: <XCircle size={16} style={{ color: "var(--accent-danger)", flexShrink: 0 }} />,
    info: <AlertCircle size={16} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-sm"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      {icons[toast.type]}
      <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
        {toast.message}
      </span>
      <button
        onClick={onRemove}
        className="ml-2 p-0.5 rounded transition-opacity hover:opacity-70"
        style={{ color: "var(--text-disabled)" }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
