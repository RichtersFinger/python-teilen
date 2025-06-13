import { FiChevronRight } from "react-icons/fi";

type itemType = "file" | "folder";

interface FileProperties {
  type: "file";
  name: string;
}

interface FolderProperties {
  type: "folder";
  name: string;
}

const data = [
  { type: "folder", name: "folder 1" },
  { type: "folder", name: "folder 2" },
  { type: "file", name: "file 1.txt" },
  { type: "file", name: "file 2.txt" },
  { type: "file", name: "file 3.txt" },
];

export default function App() {
  return (
    <div className="flex top-0 left-0 h-screen w-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full h-12 bg-white border border-gray-300 shadow-sm">
        <div className="flex flex-row h-full gap-x-5">
          <div className="flex p-2 space-x-2 items-center">
            <img src="/favicon2.svg" width={50} alt="logo" />
            <span className="font-bold text-xl">teilen</span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            {[{ name: "folder 1" }, { name: "folder 2" }, { name: "folder 3" }].map(
              (item, index) => (
                <div className="flex items-center space-x-2">
                  {index !== 0 && <FiChevronRight />}
                  <span className="p-2 font-semibold hover:cursor-pointer">
                    {item.name}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="w-screen m-2 mt-16 bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="flex flex-col h-full py-2 px-3 overflow-y-auto hide-scrollbar hover:show-scrollbar">
          <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-x-0">
            {data.map((item) => (
              <div className="flex flex-col items-center mx-5 my-1 py-2 hover:bg-gray-100">
                {item.type === "file" ? (
                  <img src="/file2.svg" alt="file" />
                ) : (
                  <img src="/folder2.svg" alt="folder" />
                )}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
