import { FileProperties, FolderProperties } from "../types";

interface FSItemProps {
  item: FileProperties | FolderProperties;
  selected?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
}

export default function FSItem({
  item,
  selected,
  onClick,
  onDoubleClick,
}: FSItemProps) {
  return (
    <div
      className={`flex flex-col items-center mx-2 my-1 py-2 hover:bg-gray-100 select-none border-4 ${
        selected ? " border-blue-300" : "border-transparent"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {item.type === "file" ? (
        <img src="/file2.svg" alt="file" />
      ) : (
        <img src="/folder2.svg" alt="folder" />
      )}
      <span className={`text-center break-all ${!selected && "line-clamp-1"}`}>
        {item.name}
      </span>
    </div>
  );
}
