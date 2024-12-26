import { configureStore } from '@reduxjs/toolkit';

export const setupApiStore = (api, extraReducers = {}) => {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      ...extraReducers,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return { store };
};
