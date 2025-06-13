interface TextInputProps {
  className?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent) => void;
}

export default function TextInput({
  className,
  value,
  placeholder,
  onChange,
}: TextInputProps) {
  return (
    <div className="relative">
      <input
        className={`p-2 border border-gray-300 rounded-lg outline-none focus:shadow-md ${className}`}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
