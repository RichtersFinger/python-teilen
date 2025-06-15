interface TextInputProps {
  className?: string;
  value?: string;
  type?: "text" | "password";
  placeholder?: string;
  icon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  className = "",
  value,
  type = "text",
  placeholder,
  icon,
  onChange,
}: TextInputProps) {
  return (
    <div className="relative">
      <div className="absolute h-full pointer-events-none">
        <div className="flex flex-row h-full px-4 items-center">{icon}</div>
      </div>
      <input
        className={`p-2 px-3 border border-gray-300 rounded-lg outline-none focus:shadow-md ${className}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
