interface TextInputProps {
  className?: string;
  value?: string;
  type?: "text" | "password";
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  className = "",
  value,
  type = "text",
  placeholder,
  onChange,
}: TextInputProps) {
  return (
    <div>
      <input
        className={`p-2 border border-gray-300 rounded-lg outline-none focus:shadow-md ${className}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
