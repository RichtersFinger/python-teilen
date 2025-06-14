import { FileProperties, FolderProperties } from "../types";

interface FSItemProps {
  item: FileProperties | FolderProperties;
  selected?: boolean;
}

export default function FSItem({ item, selected }: FSItemProps) {
  return (
    <div
      className={`flex flex-col items-center mx-2 my-1 py-2 hover:bg-gray-100 select-none ${
        selected && "border-4 border-blue-300"
      }`}
    >
      {item.type === "file" ? (
        <img src="/file2.svg" alt="file" />
      ) : (
        <img src="/folder2.svg" alt="folder" />
      )}
      <span className={`text-center ${!selected && "line-clamp-1"}`}>
        {item.name}
      </span>
    </div>
  );
}
