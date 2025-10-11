import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import { centeredEllipsis, toHumanReadableSize } from "./util";
import Modal from "./base/Modal";
import Spinner from "./base/Spinner";
import Button from "./base/Button";

interface ArchiveDownloadModalProps {
  show: boolean;
  onDismiss?: () => void;
  archiveId: string;
}

interface ArchiveDownloadProgress {
  status: "queued" | "running" | "completed" | "unknown";
  processedFiles?: number;
  totalFiles?: number;
  currentFile?: string;
  archiveSize?: number;
  artifact?: string;
}

export default function ArchiveDownloadModal({
  show,
  onDismiss,
  archiveId,
}: ArchiveDownloadModalProps) {
  const [progress, setProgress] = useState<ArchiveDownloadProgress | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(
        (process.env.REACT_APP_API_BASE_URL ?? "") +
          "/archive-progress?" +
          new URLSearchParams({
            id: archiveId,
          }).toString(),
        { credentials: "include" }
      )
        .then((response) => {
          if (response.ok) {
            response.json().then((json) => {
              setProgress(json);
              if (!["queued", "running"].includes(json["status"])) {
                clearInterval(interval);
              }
            });
          } else {
            response
              .text()
              .then((text) => setError(`Fetching progress failed: ${text}`));
            clearInterval(interval);
          }
        })
        .catch((error) => {
          setError(`Error while fetching progress: ${error.message}`);
          clearInterval(interval);
          console.error(error);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [archiveId]);

  return show ? (
    <Modal
      className="min-w-96 w-1/3"
      header={<h2 className="text-xl font-bold">Downloading Archive</h2>}
      body={
        <div className="flex flex-col space-y-2">
          {error !== undefined && (
            <div className="relative p-2 pr-10 rounded-lg border border-red-400 bg-red-200 text-red-600">
              {error}
              <FiX
                size={25}
                className="absolute right-4 top-2 p-1 aspect-square rounded-lg hover:cursor-pointer outline-1 outline-red-400 hover:outline hover:bg-red-300"
                onClick={() => setError(undefined)}
              />
            </div>
          )}
          <>
            {progress?.status === "queued" && (
              <h3 className="font-semibold">
                Your archive will be built soon...
              </h3>
            )}
            {(progress?.status === undefined ||
              progress.status === "queued") && (
              <div className="flex flex-row w-full items-center justify-center space-x-2">
                <Spinner size="lg" />
              </div>
            )}
            {progress?.status === "running" && (
              <h3 className="font-semibold">Your archive is being built...</h3>
            )}
            {progress?.status === "completed" && (
              <h3 className="font-semibold">
                Your archive download is ready...
              </h3>
            )}
            <div className="ml-4 flex flex-col space-y-1 text-gray-500">
              {progress?.currentFile !== undefined &&
                progress.currentFile !== null && (
                  <span className="text-nowrap overflow-hidden text-ellipsis">
                    Processing file '
                    <span className="italic">
                      {centeredEllipsis(progress.currentFile)}
                    </span>
                    '
                  </span>
                )}
              {progress?.processedFiles !== undefined &&
                progress?.totalFiles !== undefined && (
                  <div className="flex flex-row space-x-2">
                    <span className="text-nowrap overflow-hidden text-ellipsis">
                      {`Files ${progress.processedFiles}/${progress.totalFiles}`}
                    </span>
                    {progress.status === "running" && <Spinner size="xs" />}
                  </div>
                )}
              {progress?.archiveSize !== undefined && (
                <div className="flex flex-row space-x-2">
                  <span className="text-nowrap overflow-hidden text-ellipsis">
                    {`Size ${toHumanReadableSize(progress.archiveSize)}`}
                  </span>
                  {progress.status === "running" && <Spinner size="xs" />}
                </div>
              )}
            </div>
          </>
          {progress?.status === "completed" && (
            <div className="flex items-center justify-center">
              <Button
                onClick={() => {
                  setDownloadStarted(true);
                  window.open(
                    (process.env.REACT_APP_API_BASE_URL ?? "") +
                      "/archive?" +
                      new URLSearchParams({ id: archiveId }).toString()
                  );
                }}
              >
                Download
              </Button>
            </div>
          )}
        </div>
      }
      onDismiss={() => {
        if (
          !downloadStarted &&
          !window.confirm(
            "Your download has not been started yet. If you close this modal now, you will need to restart this process."
          )
        )
          return;
        fetch(
          (process.env.REACT_APP_API_BASE_URL ?? "") +
            "/archive?" +
            new URLSearchParams({
              id: archiveId,
            }).toString(),
          { method: "DELETE", credentials: "include" }
        );
        onDismiss?.();
      }}
    />
  ) : null;
}
