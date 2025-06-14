import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

import { ContentItem, FileProperties, FolderProperties } from "./types";
import FSItem from "./components/FSItem";

export const baseUrl = process.env.REACT_APP_API_BASE_URL ?? "";

export default function App() {
  const [location, setLocation] = useState<string[]>([
    "venv",
    "lib",
    "python3.12",
    "site-packages",
  ]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selection, setSelection] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetch(
      baseUrl +
        "/content?" +
        new URLSearchParams({
          location: encodeURIComponent(location.join("/")),
        }).toString()
    )
      .then((response) => {
        if (response.ok) {
          return response.json().then((json) =>
            setContent(
              (json as (FileProperties | FolderProperties)[]).map(
                (item, index) => {
                  return { ...item, index };
                }
              )
            )
          );
        }
      })
      .catch((error) => console.error(error));
  }, [location]);

  return (
    <div className="flex top-0 left-0 h-screen w-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full h-12 bg-white border border-gray-300 shadow-sm">
        <div className="flex flex-row h-full gap-x-5">
          <div className="flex p-2 space-x-2 items-center">
            <img src="/favicon2.svg" width={50} alt="logo" />
            <span className="font-bold text-xl">teilen</span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            {location.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index !== 0 && <FiChevronRight />}
                <span className="p-2 font-semibold hover:cursor-pointer">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-screen m-2 mt-16 bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="flex flex-col h-full py-2 px-3 overflow-y-auto hide-scrollbar hover:show-scrollbar">
          <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-x-0">
            {content
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .sort((a, b) => (a.type > b.type ? -1 : 1))
              .map((item) => (
                <FSItem
                  key={item.index}
                  item={item}
                  selected={selection === item.index}
                  onClick={() => {
                    setSelection(item.index);
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
