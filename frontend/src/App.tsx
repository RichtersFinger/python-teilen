import { useEffect, useState } from "react";

import { ContentItem, FileProperties, FolderProperties } from "./types";
import FSItem from "./components/FSItem";
import AppHeader from "./components/AppHeader";
import Spinner from "./components/base/Spinner";

export default function App() {
  const [location, setLocation] = useState<string[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selection, setSelection] = useState<number | undefined>(undefined);

  useEffect(() => {
    setLoadingContent(true);
    fetch(
      (process.env.REACT_APP_API_BASE_URL ?? "") +
        "/content?" +
        new URLSearchParams({
          location: encodeURIComponent(location.join("/")),
        }).toString()
    )
      .then((response) => {
        setLoadingContent(false);
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
      .catch((error) => {
        setLoadingContent(false);
        console.error(error);
      });
  }, [location]);

  useEffect(() => {
    setSelection(undefined);
  }, [location]);

  return (
    <div
      className="flex top-0 left-0 h-screen w-screen bg-gray-50"
      onClick={() => setSelection(undefined)}
    >
      <AppHeader location={location} setLocation={setLocation} />
      <div className="w-screen m-2 mt-16 bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="flex flex-col h-full py-2 px-3 overflow-y-auto hide-scrollbar hover:show-scrollbar">
          {loadingContent ? (
            <div className="h-full w-full justify-items-center mt-5 ">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-flow-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-x-0">
              {content
                .sort((a, b) => (a.name < b.name ? -1 : 1))
                .sort((a, b) => (a.type > b.type ? -1 : 1))
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
      </div>
    </div>
  );
}
