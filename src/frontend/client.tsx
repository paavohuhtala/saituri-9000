import "./reset.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { appStore } from "./redux/store";
import { Home } from "./Home";
import { Layout } from "./BasePage";
import { ExpenseGroup } from "./expenseGroup/ExpenseGroup";
import { NewExpense } from "./expense/NewExpense";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const App = () => {
  return (
    <StrictMode>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="expense-group/:id" element={<ExpenseGroup />} />
              <Route path="expense-group/:id/new" element={<NewExpense />} />
              <Route path="*" element={<Navigate to={"/"} replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
};

createRoot(root).render(<App />);
