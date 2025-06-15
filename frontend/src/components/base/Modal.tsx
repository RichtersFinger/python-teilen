import { createPortal } from "react-dom";

interface ModalProps {
  className?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  onDismiss?: () => void;
}

export default function Modal({
  className = "",
  header,
  body,
  footer,
  onDismiss,
}: ModalProps) {
  return createPortal(
    <div
      className="fixed bg-opacity-50 bg-black top-0 left-0 h-screen w-screen flex items-center justify-center"
      onClick={onDismiss}
    >
      <div
        className={`flex flex-col p-5 rounded-xl bg-white shadow-lg space-y-2 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>{header}</div>
        {header && body ? <hr /> : null}
        <div>{body}</div>
        <div>{footer}</div>
      </div>
    </div>,
    document.body
  );
}
