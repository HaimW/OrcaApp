import { configureStore } from '@reduxjs/toolkit';
import diveEntriesReducer from './slices/diveEntriesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    diveEntries: diveEntriesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Ignore Firebase User objects in auth state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

