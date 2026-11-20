export let configuration = {};

export const ContentType = {
  directory: "directory",
  file: "file",
};

export let content = {
  "folder-1": {
    id: "folder-1",
    kind: ContentType.directory,
    name: "folder 1",
    selected: false,
  },
  "folder-2": {
    id: "folder-2",
    kind: ContentType.directory,
    name: "folder 2",
    selected: false,
  },
  "folder-3": {
    id: "folder-3",
    kind: ContentType.directory,
    name: "folder 3",
    selected: false,
  },
  "file-1": {
    id: "file-1",
    kind: ContentType.file,
    name: "file 1",
    selected: false,
  },
  "file-2": {
    id: "file-2",
    kind: ContentType.file,
    name: "file 2",
    selected: false,
  },
};
