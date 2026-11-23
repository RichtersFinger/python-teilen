export const LocationStore = {
  location: [],
};

export const LocationSubscriptions = {
  subscribers: [],
  notify: () => {
    LocationSubscriptions.subscribers.forEach((s) => s.callback());
  },
  subscribe: (callback) => {
    LocationSubscriptions.subscribers.push({ callback });
  },
  unsubscribe: (callback) => {
    LocationSubscriptions.subscribers =
      LocationSubscriptions.subscribers.filter((s) => s.callback !== callback);
  },
};

export const LocationActions = {
  clearPath: () => {
    LocationStore.location = [];
    LocationSubscriptions.notify();
  },
  navigateRelative: (segment) => {
    LocationStore.location.push(segment);
    LocationSubscriptions.notify();
  },
  navigateAbsolute: (location) => {
    LocationStore.location = [...location];
    LocationSubscriptions.notify();
  },
};

globalThis.__location = {
  LocationStore,
  LocationSubscriptions,
  LocationActions,
};
