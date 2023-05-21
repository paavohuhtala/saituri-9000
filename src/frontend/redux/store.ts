import { configureStore } from "@reduxjs/toolkit";
import { expenseGroupApi } from "./expenseGroupApi";
import { membersApi } from "./memberApi";

export const appStore = configureStore({
  reducer: {
    expenseGroupApi: expenseGroupApi.reducer,
    membersApi: membersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expenseGroupApi.middleware).concat(membersApi.middleware),
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export type AppThunkConfig = { state: AppState; dispatch: AppDispatch };
