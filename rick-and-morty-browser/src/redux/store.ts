import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './features/charactersSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
