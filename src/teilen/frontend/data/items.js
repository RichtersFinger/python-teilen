export const ItemsStore = {};

export const ItemsSubscriptions = {
  subscribers: [],
  notify: (id) => {
    ItemsSubscriptions.subscribers.forEach(
      (s) => (id === undefined || s.id === id) && s.callback(id),
    );
  },
  subscribe: (id, callback) => {
    ItemsSubscriptions.subscribers.push({ id, callback });
  },
  unsubscribe: (callback) => {
    ItemsSubscriptions.subscribers = ItemsSubscriptions.subscribers.filter(
      (s) => s.callback !== callback,
    );
  },
};

export const ItemsActions = {
  // store management
  clearItems: () => {
    for (const id in ItemsStore) {
      delete ItemsStore[id];
    }
    ItemsSubscriptions.notify();
  },
  addItem: (id, component) => {
    ItemsStore[id] = component;
    ItemsSubscriptions.notify(id);
  },
  removeItem: (id) => {
    delete ItemsStore[id];
    ItemsSubscriptions.notify(id);
  },

  // item selection
  clearSelection: () => {
    Object.values(ItemsStore).forEach((item) => item.unselect());
    ItemsSubscriptions.notify();
  },
  selectItem: (id) => {
    ItemsStore[id]?.select();
    ItemsSubscriptions.notify(id);
  },
  unselectItem: (id) => {
    ItemsStore[id]?.unselect();
    ItemsSubscriptions.notify(id);
  },
};

globalThis.__items = { ItemsStore, ItemsSubscriptions, ItemsActions };
