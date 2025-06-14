interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Badge({
  className = "",
  children,
  onClick,
}: BadgeProps) {
  return (
    <div
      className={`flex flex-row space-x-2 items-center px-2 py-1 bg-gray-300 rounded-xl text-nowrap ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
