interface ModalProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  onDismiss?: () => void;
}

export default function Modal({ header, body, footer, onDismiss }: ModalProps) {
  return (
    <div
      className="fixed z-50 bg-opacity-50 bg-black top-0 left-0 h-screen w-screen flex items-center justify-center"
      onClick={onDismiss}
    >
      <div className="flex flex-col p-5 rounded-xl bg-white shadow-lg">
        <div>{header}</div>
        <div>{body}</div>
        <div>{footer}</div>
      </div>
    </div>
  );
}
