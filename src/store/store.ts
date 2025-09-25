import { configureStore } from '@reduxjs/toolkit';
import diveEntriesReducer from './slices/diveEntriesSlice';

export const store = configureStore({
  reducer: {
    diveEntries: diveEntriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

