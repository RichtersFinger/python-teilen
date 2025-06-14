export interface FileProperties {
  type: "file";
  name: string;
  mtime: number;
  size: number;
}

export interface FolderProperties {
  type: "folder";
  name: string;
  mtime: number;
}

export type ContentItem = (FileProperties | FolderProperties) & {
  index: number;
};
