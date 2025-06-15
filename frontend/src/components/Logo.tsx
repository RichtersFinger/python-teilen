interface LogoProps {
  className?: string;
  withText?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Logo({
  className = "",
  withText = true,
  onClick,
}: LogoProps) {
  return (
    <div
      className={`flex p-2 space-x-2 items-center select-none ${className}`}
      onClick={onClick}
    >
      <img src="/favicon2.svg" width={50} alt="logo" />
      {withText && <span className="font-bold text-xl">teilen</span>}
    </div>
  );
}
