export interface FileProperties {
  type: "file";
  name: string;
}

export interface FolderProperties {
  type: "folder";
  name: string;
}

export type ContentItem = (FileProperties | FolderProperties) & {
  index: number;
};
