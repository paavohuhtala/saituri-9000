import "./reset.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { appStore } from "./redux/store";
import { RootRoute, Route, Router, RouterProvider, useParams } from "@tanstack/router";
import { Home } from "./Home";
import { Layout } from "./BasePage";
import { ExpenseGroup } from "./expenseGroup/ExpenseGroup";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const rootRoute = new RootRoute({
  component: Layout,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const expenseGroupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/expense-group/$id",
  component: () => {
    const { id } = useParams({ from: expenseGroupRoute.id });
    return <ExpenseGroup groupId={id} />;
  },
});

const routeTree = rootRoute.addChildren([expenseGroupRoute, homeRoute]);

const router = new Router({
  routeTree,
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <StrictMode>
      <Provider store={appStore}>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  );
};

createRoot(root).render(<App />);
