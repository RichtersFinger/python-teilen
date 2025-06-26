import { useContext, useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronUp,
  FiRotateCw,
  FiSearch,
} from "react-icons/fi";

import { ContentItem, FileProperties, FolderProperties } from "../types";
import { useToaster } from "./base/Toaster";
import { AuthContext } from "../App";
import Modal from "./base/Modal";
import Spinner from "./base/Spinner";
import Button from "./base/Button";
import FSItem from "./FSItem";
import TextInput from "./base/TextInput";
import Select from "./base/Select";

type SortBy =
  | "name-ascending"
  | "name-descending"
  | "date-ascending"
  | "date-descending"
  | "size-ascending"
  | "size-descending";

/**
 * Returns size in human readable unit.
 * @param size size in B
 */
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

/**
 * Fetch file and handle response.
 * @param location file path
 * @param onBlob callback to be run when blob is read
 * @param password auth-info
 * @param onLoading callback to be used before running fetch
 * @param onComplete callback to be used after everything is loaded
 * @param onError callback to be used in case a problem occurs
 */
function fetchFile(
  location: string[],
  password: string | undefined,
  onBlob: (blob: Blob) => void,
  onLoading?: () => void,
  onComplete?: () => void,
  onError?: () => void
) {
  onLoading?.();
  fetch(
    (process.env.REACT_APP_API_BASE_URL ?? "") +
      "/content?" +
      new URLSearchParams({
        location: encodeURIComponent(location.join("/")),
      }).toString(),
    {
      headers: password
        ? {
            "X-Teilen-Auth": password,
          }
        : {},
    }
  )
    .then((response) => {
      if (response.ok)
        response
          .blob()
          .then((blob) => {
            onComplete?.();
            onBlob(blob);
          })
          .catch((error) => {
            onError?.();
            console.error(error);
          });
      else onError?.();
    })
    .catch((error) => {
      onError?.();
      console.error(error);
    });
}

interface FSViewerProps {
  location: string[];
  setLocation: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FSViewer({ location, setLocation }: FSViewerProps) {
  const { toast } = useToaster();

  const password = useContext(AuthContext);
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const [loadingContent, setLoadingContent] = useState(false);
  const [content, setContent] = useState<Record<number, ContentItem>>({});

  const [preparingDownload, setPreparingDownload] = useState(false);

  const [history, setHistory] = useState<string[][]>([]);
  const [searchFor, setSearchFor] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name-ascending");

  // fetch data from API when location changes
  useEffect(() => {
    setLoadingContent(true);
    fetch(
      (process.env.REACT_APP_API_BASE_URL ?? "") +
        "/contents?" +
        new URLSearchParams({
          location: encodeURIComponent(location.join("/")),
        }).toString(),
      {
        headers: password
          ? {
              "X-Teilen-Auth": password,
            }
          : {},
      }
    )
      .then((response) => {
        setLoadingContent(false);
        if (response.ok) {
          return response
            .json()
            .then((json) =>
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
            )
            .catch((error) => {
              setContent({});
              toast(
                `Failed to process index for '/${location.join("/")}'.`,
                <FiAlertCircle className="text-red-500" size={20} />
              );
              console.error(error);
            });
        } else {
          setContent({});
          toast(
            `Failed to fetch index for '/${location.join("/")}'.`,
            <FiAlertCircle className="text-red-500" size={20} />
          );
        }
      })
      .catch((error) => {
        setLoadingContent(false);
        setContent({});
        toast(
          `Failed to fetch index for '/${location.join("/")}'.`,
          <FiAlertCircle className="text-red-500" size={20} />
        );
        console.error(error);
      });
  }, [toast, location, password]);

  // track changed location in history
  useEffect(() => {
    setHistory((prev) => {
      if (
        prev.length > 0 &&
        JSON.stringify(location) === JSON.stringify(prev[prev.length - 1])
      )
        return prev;
      return [...prev, location];
    });
  }, [location]);

  // unselect if location changes
  useEffect(() => {
    setSelection(undefined);
  }, [location]);

  return (
    <div className="flex flex-col w-screen m-2 mt-16 space-y-2">
      {/*
       * loading-state modal
       */}
      {preparingDownload && (
        <Modal
          header={<h2 className="text-xl font-bold">Preparing download..</h2>}
          body={
            <div className="flex items-center justify-center m-5">
              <Spinner />
            </div>
          }
        />
      )}
      {/* toolbar
       * - back-navigation
       * - filter by name
       * - sort-by: name, file-size (sort dir by name), date
       */}
      <div className="flex flex-wrap space-x-2 md:flex-row md:justify-between">
        <div className="flex flex-row space-x-2 py-1">
          <Button
            disabled={history.length <= 1}
            onClick={() => {
              if (history.length <= 1) return;
              setLocation(history[history.length - 2]);
              setHistory(history.slice(0, history.length - 2));
            }}
          >
            <div className="flex flex-row space-x-2 items-center">
              <FiChevronLeft /> <span>Back</span>
            </div>
          </Button>
          <Button
            disabled={location.length === 0}
            onClick={() => {
              setLocation(location.slice(0, location.length - 1));
            }}
          >
            <div className="flex flex-row space-x-2 items-center">
              <FiChevronUp /> <span>Up</span>
            </div>
          </Button>
          <Button
            disabled={loadingContent}
            onClick={() => setLocation((prev) => [...prev])}
          >
            <div className="flex flex-row items-center">
              {loadingContent ? <Spinner size="xs" /> : <FiRotateCw />}
              {
                // create same size on container
                <span className="invisible w-0">Refresh</span>
              }
            </div>
          </Button>
        </div>
        <div className="py-1">
          <TextInput
            value={searchFor}
            onChange={(e) => setSearchFor(e.target.value)}
            icon={
              searchFor ? undefined : (
                <div className="flex flex-row items-center text-gray-500 space-x-2">
                  <FiSearch size={20} />
                  <span>Search</span>
                </div>
              )
            }
          />
        </div>
        <div className="py-1">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="name-ascending">Sort by name</option>
            <option value="name-descending">Sort by name (descending)</option>
            <option value="date-ascending">Sort by date</option>
            <option value="date-descending">Sort by date (descending)</option>
            <option value="size-ascending">Sort by size</option>
            <option value="size-descending">Sort by size (descending)</option>
          </Select>
        </div>
      </div>
      <div
        className="relative grow bg-white rounded-lg border border-gray-300 overflow-hidden"
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
                .filter((item) => {
                  if (searchFor === "") return true;
                  return item.name
                    .toLowerCase()
                    .includes(searchFor.toLowerCase());
                })
                .sort((a, b) => {
                  if (a.type === b.type) {
                    switch (sortBy) {
                      case "name-ascending":
                        return a.name.toLowerCase() < b.name.toLowerCase()
                          ? -1
                          : 1;
                      case "name-descending":
                        return a.name.toLowerCase() > b.name.toLowerCase()
                          ? -1
                          : 1;
                      case "date-ascending":
                        return a.mtime > b.mtime ? -1 : 1;
                      case "date-descending":
                        return a.mtime < b.mtime ? -1 : 1;
                      case "size-ascending":
                        if (a.type === "file" && b.type === "file")
                          return a.size < b.size ? -1 : 1;
                        // default to name-ascending
                        return a.name.toLowerCase() < b.name.toLowerCase()
                          ? -1
                          : 1;
                      case "size-descending":
                        if (a.type === "file" && b.type === "file")
                          return a.size > b.size ? -1 : 1;
                        // default to name-ascending
                        return a.name.toLowerCase() < b.name.toLowerCase()
                          ? -1
                          : 1;
                      default:
                        return 0;
                    }
                  }
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
                      if (item.type === "file") {
                        // open in new tab to try and show content in browser
                        fetchFile(
                          [...location, item.name],
                          password,
                          (blob) =>
                            window.open(window.URL.createObjectURL(blob)),
                          () => setPreparingDownload(true),
                          () => setPreparingDownload(false),
                          () => {
                            setPreparingDownload(false);
                            toast(
                              `Failed to load file '/${[
                                ...location,
                                item.name,
                              ].join("/")}'`,
                              <FiAlertCircle
                                className="text-red-500"
                                size={20}
                              />
                            );
                          }
                        );
                      } else {
                        setLocation((prev) => [...prev, item.name]);
                      }
                    }}
                  />
                ))}
            </div>
          )}
        </div>
        {/* file-info */}
        {selection !== undefined && (
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
                <span className="font-semibold text-nowrap">
                  Last modified:
                </span>
                <span>
                  {new Date(
                    // API reports datetime in seconds since epoch
                    // > transform to milliseconds
                    content[selection].mtime * 1000
                  ).toUTCString()}
                </span>
              </div>
              {content[selection].type === "file" && (
                <div className="flex flex-row space-x-2">
                  <span className="font-semibold text-nowrap">Size:</span>
                  <span>
                    {toHumanReadableSize(
                      (content[selection] as FileProperties).size
                    )}
                  </span>
                </div>
              )}
              <div className="flex flex-row space-x-2">
                {content[selection].type === "file" && (
                  <Button
                    onClick={() =>
                      fetchFile(
                        [...location, content[selection].name],
                        password,
                        (blob) => window.open(window.URL.createObjectURL(blob)),
                        () => setPreparingDownload(true),
                        () => setPreparingDownload(false),
                        () => {
                          setPreparingDownload(false);
                          toast(
                            `Failed to load file '/${[
                              ...location,
                              content[selection].name,
                            ].join("/")}'`,
                            <FiAlertCircle className="text-red-500" size={20} />
                          );
                        }
                      )
                    }
                  >
                    View in Browser
                  </Button>
                )}
                <Button
                  onClick={() => {
                    fetchFile(
                      [...location, content[selection].name],
                      password,
                      (blob) => {
                        // open "save as"-dialog
                        downloadRef.current!.href =
                          window.URL.createObjectURL(blob);
                        downloadRef.current!.download = content[selection].name;
                        downloadRef.current!.click();
                      },
                      () => setPreparingDownload(true),
                      () => setPreparingDownload(false),
                      () => {
                        setPreparingDownload(false);
                        toast(
                          `Failed to load file '/${[
                            ...location,
                            content[selection].name,
                          ].join("/")}'`,
                          <FiAlertCircle className="text-red-500" size={20} />
                        );
                      }
                    );
                  }}
                >
                  Download
                </Button>
                <a ref={downloadRef} className="hidden" href="data:">
                  placeholder
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
