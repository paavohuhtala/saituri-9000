import { configureStore } from "@reduxjs/toolkit";
import { saituriApi } from "./saituriApi";

export const appStore = configureStore({
  reducer: {
    saituriApi: saituriApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saituriApi.middleware),
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export type AppThunkConfig = { state: AppState; dispatch: AppDispatch };
