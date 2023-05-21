import { configureStore } from "@reduxjs/toolkit";
import { expenseGroupApi } from "./expenseGroupApi";

export const appStore = configureStore({
  reducer: {
    expenseGroupApi: expenseGroupApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(expenseGroupApi.middleware),
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export type AppThunkConfig = { state: AppState; dispatch: AppDispatch };
