import { useEffect, useState } from "react";

import { ContentItem, FileProperties, FolderProperties } from "../types";
import FSItem from "./FSItem";
import Spinner from "./base/Spinner";

function toHumanReadableSize(size: number): string {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let unit = -1;
  for (let i = 0; i < units.length; i++) {
    if (size < 1024 ** (i + 1)) {
      unit = i;
      break;
    }
  }
  if (unit === -1) return "> 1000 TB";
  return `${(size / 1024 ** unit).toFixed(unit <= 1 ? 0 : 1)} ${units[unit]}`;
}

interface FSViewerProps {
  location: string[];
  setLocation: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FSViewer({ location, setLocation }: FSViewerProps) {
  const [selection, setSelection] = useState<number | undefined>(undefined);

  const [loadingContent, setLoadingContent] = useState(false);
  const [content, setContent] = useState<Record<number, ContentItem>>({});

  // fetch data from API when location changes
  useEffect(() => {
    setLoadingContent(true);
    fetch(
      (process.env.REACT_APP_API_BASE_URL ?? "") +
        "/contents?" +
        new URLSearchParams({
          location: encodeURIComponent(location.join("/")),
        }).toString()
    )
      .then((response) => {
        setLoadingContent(false);
        if (response.ok) {
          return response.json().then((json) =>
            setContent(
              (json as (FileProperties | FolderProperties)[])
                .map((item, index) => {
                  return { ...item, index };
                })
                .reduce((acc, item) => {
                  acc[item.index] = item;
                  return acc;
                }, {} as Record<number, ContentItem>)
            )
          );
        }
      })
      .catch((error) => {
        setLoadingContent(false);
        console.error(error);
      });
  }, [location]);

  // unselect if location changes
  useEffect(() => {
    setSelection(undefined);
  }, [location]);

  return (
    <div
      className="relative w-screen m-2 mt-16 bg-white rounded-lg border border-gray-300 overflow-hidden"
      onClick={() => setSelection(undefined)}
    >
      {/* viewer body */}
      <div className="flex flex-col h-full py-2 px-3 overflow-y-auto hide-scrollbar hover:show-scrollbar">
        {loadingContent ? (
          <div className="h-full w-full justify-items-center mt-5 ">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-x-0">
            {Object.values(content)
              .sort((a, b) => {
                if (a.type === b.type)
                  return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
                return a.type > b.type ? -1 : 1;
              })
              .map((item) => (
                <FSItem
                  key={item.index}
                  item={item}
                  selected={selection === item.index}
                  onClick={(e) => {
                    setSelection(item.index);
                    e.stopPropagation();
                  }}
                  onDoubleClick={() => {
                    if (item.type === "file") return;
                    setLocation((prev) => [...prev, item.name]);
                  }}
                />
              ))}
          </div>
        )}
      </div>
      {/* file-info */}
      {selection !== undefined && content[selection].type === "file" && (
        <div
          className="absolute p-3 right-4 bottom-4 border rounded-md bg-gray-100 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-2">
              <span className="font-semibold text-nowrap">Name:</span>
              <span>{content[selection].name}</span>
            </div>
            <div className="flex flex-row space-x-2">
              <span className="font-semibold text-nowrap">Last modified:</span>
              <span>
                {new Date(
                  // API reports datetime in seconds since epoch
                  // > transform to milliseconds
                  content[selection].mtime * 1000
                ).toUTCString()}
              </span>
            </div>
            <div className="flex flex-row space-x-2">
              <span className="font-semibold text-nowrap">Size:</span>
              <span>
                {toHumanReadableSize(
                  (content[selection] as FileProperties).size
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
