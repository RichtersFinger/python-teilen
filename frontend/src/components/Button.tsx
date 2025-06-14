type ButtonColor = "default" | "blue";
type ButtonSize = "sm" | "base";

const ButtonColorStyles = {
  disabled:
    "bg-gray-100 border-gray-300 text-gray-500 hover:shadow-none hover:cursor-not-allowed",
  default:
    "bg-white border-gray-300 text-black hover:bg-gray-200 active:bg-white",
  blue: "bg-blue-500 border-blue-500 text-white hover:bg-blue-400 active:bg-blue-700 hover:border-blue-400",
};

const ButtonSizingStyles = {
  base: "text-base px-4 py-2",
  sm: "text-sm px-2 py-1",
};

interface ButtonProps {
  className?: string;
  type?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Button({
  className,
  type: kind = "default",
  size = "base",
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <div>
      <button
        className={`border rounded-lg transition duration-100 ease-in hover:shadow-md ${
          ButtonColorStyles[disabled ? "disabled" : kind]
        } ${ButtonSizingStyles[size]} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
