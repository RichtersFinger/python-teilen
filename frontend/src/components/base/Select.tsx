import { FiChevronDown } from "react-icons/fi";

interface SelectProps {
  className?: string;
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({
  className = "",
  value,
  disabled = false,
  children,
  onChange,
}: SelectProps) {
  return (
    <div className="relative">
      <div className="absolute h-full right-2 pointer-events-none">
        <div className="flex flex-row h-full items-center">
          <FiChevronDown />
        </div>
      </div>
      <select
        className={`p-2 px-3 pe-10 border bg-white border-gray-300 rounded-lg outline-none focus:shadow-md no-arrow ${className}`}
        value={value}
        disabled={disabled}
        onChange={onChange}
      >
        {children}
      </select>
    </div>
  );
}
