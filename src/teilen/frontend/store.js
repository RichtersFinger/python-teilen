export let configuration = {};

export const ContentType = {
  directory: "directory",
  file: "file",
};

/**
 * Content by ID.
 */
export let content = {
  "folder-1": {
    id: "folder-1",
    kind: ContentType.directory,
  },
  "folder-2": {
    id: "folder-2",
    kind: ContentType.directory,
  },
  "folder-3": {
    id: "folder-3",
    kind: ContentType.directory,
  },
  "file-1": {
    id: "file-1",
    kind: ContentType.file,
  },
  "file-2": {
    id: "file-2",
    kind: ContentType.file,
  },
};

/** ContentSubscriptions */
export const contentSubscriptions = {
  /**
   * Callback that is executed on change.
   *
   * @callback OnChangeCallback
   * @param {boolean} selected new selected-status
   * @returns {void}
   */

  subscribers: {},

  /**
   * Clear selection.
   */
  clearSelection: () => {
    for (const list of Object.values(contentSubscriptions.subscribers)) {
      for (const cb of list) {
        cb(false);
      }
    }
  },

  /**
   * Notify about selection change by ID.
   * @param {string} contentId affected ID
   * @param {boolean} selected new value
   */
  updateSelection: (contentId, selected) => {
    if (!contentSubscriptions.subscribers[contentId]) return;
    for (const cb of contentSubscriptions.subscribers[contentId]) {
      cb(selected);
    }
  },

  /**
   * Subscribe by `contentId` and providing a callback `(contentId, selected: boolean) => void`.
   * @param {string} contentId identifying the target content
   * @param {OnChangeCallback} callback onChange callback, `(selected: boolean) => void`
   */
  subscribe: (contentId, callback) => {
    // init empty list
    if (!contentSubscriptions.subscribers[contentId])
      contentSubscriptions.subscribers[contentId] = [];

    contentSubscriptions.subscribers[contentId].push(callback);
  },

  /**
   * Undos a previous subscription.
   * @param contentId `string` identifying the target content
   * @param callback reference to the original subscription callback
   */
  unsubscribe: (contentId, callback) => {
    if (!contentSubscriptions.subscribers[contentId]) return;

    contentSubscriptions.subscribers[contentId] =
      contentSubscriptions.subscribers[contentId].filter(
        (cb) => cb !== callback,
      );
  },
};

globalThis.__contentSubscriptions = contentSubscriptions;
