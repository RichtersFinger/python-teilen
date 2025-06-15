import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

// types
interface Toast {
  id: number;
  message: string;
  duration: number;
  icon?: React.ReactNode;
}
interface ToastStore {
  toasts: Toast[];
  subscribers: Set<() => void>;
  get: () => Toast[];
  subscribe: (callback: () => void) => () => void;
  toast: (message: string, icon?: React.ReactNode, duration?: number) => void;
  dropToast: (index: number) => void;
}

// custom store implementation
const toastStore: ToastStore = {
  toasts: [],
  subscribers: new Set(),
  get() {
    return toastStore.toasts;
  },
  subscribe(callback) {
    toastStore.subscribers.add(callback);
    return () => toastStore.subscribers.delete(callback);
  },
  toast(message, icon, duration) {
    toastStore.toasts = [
      ...toastStore.toasts,
      { id: Date.now(), message, icon, duration: duration || 5000 },
    ];
    toastStore.subscribers.forEach((callback) => callback());
  },
  dropToast(id: number) {
    toastStore.toasts = toastStore.toasts.filter((toast) => toast.id !== id);
    toastStore.subscribers.forEach((callback) => callback());
  },
};

/**
 * Toaster-hook that exports.
 * @inner toasts currently existing Toasts
 * @inner toast callback to generate new Toast
 * @inner dropToast callback to drop specific Toast
 */
export function useToaster() {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.get);

  return {
    toasts,
    toast: toastStore.toast,
    dropToast: toastStore.dropToast,
  };
}

// toaster-component
export default function Toaster() {
  const { toasts, dropToast } = useToaster();
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setTimeouts(
      toasts.map((toast) =>
        setTimeout(
          () => dropToast(toast.id),
          toast.duration - (Date.now() - toast.id)
        )
      )
    );
    return timeouts.forEach((timeout) => clearTimeout(timeout));
    // eslint-disable-next-line
  }, [toasts, dropToast]);

  return createPortal(
    <div className="fixed z-50 w-full sm:w-8/12 md:w-1/2 lg:w-1/3 right-2 bottom-2">
      <div className="flex flex-col space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex flex-row space-x-4 items-center p-4 bg-white border-2 border-gray-100 rounded-lg shadow-lg"
          >
            <div className="flex w-8 h-8 overflow-clip items-center justify-center">
              {toast.icon}
            </div>
            <div className="grow">
              <span>{toast.message}</span>
            </div>
            <div
              className="text-gray-500 hover:text-gray-800 p-2 rounded-md border border-transparent hover:border-gray-200 active:bg-white hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => toastStore.dropToast(toast.id)}
            >
              <FiX size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
