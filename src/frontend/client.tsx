import "./reset.css";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { appStore } from "./redux/store";
import { Home } from "./Home";
import { Layout } from "./BasePage";
import { ExpenseGroup } from "./expenseGroup/ExpenseGroup";
import { NewExpenseForm } from "./expense/NewExpenseForm";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { EditExpenseForm } from "./expense/EditExpenseForm";
import { EditMember } from "./member/EditMember";
import { EditExpenseGroupMember } from "./member/EditExpenseGroupMember";
import { CreatePayments } from "./payments/CreatePayments";
import { Crumb, CrumbParams } from "./common/Breadcrumbs";
import { EditPaymentForm } from "./payments/EditPaymentForm";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "member/:id",
        element: <EditMember />,
        handle: {
          crumb: ({ member }: CrumbParams): Crumb[] => [
            { label: "Kaikki jäsenet", to: "/" },
            { label: member?.name ?? "Jäsen" },
          ],
        },
      },
      {
        path: "expense-group/:expenseGroupId",
        handle: {
          crumb: ({ expenseGroup }: CrumbParams): Crumb[] => [
            { label: "Kuluryhmät", to: "/" },
            { label: expenseGroup?.name ?? "Kuluryhmä", to: `/expense-group/${expenseGroup?.id}` },
          ],
        },
        children: [
          { path: "", element: <ExpenseGroup /> },
          {
            path: "member/:memberId",
            element: <EditExpenseGroupMember />,
            handle: {
              crumb: ({ member }: CrumbParams): Crumb[] => [{ label: "Jäsenet" }, { label: member?.name ?? "Jäsen" }],
            },
          },
          {
            path: "expense",
            handle: {
              crumb: () => [{ label: "Kulut" }],
            },
            children: [
              {
                path: ":expenseId",
                element: <EditExpenseForm />,
                handle: {
                  crumb: ({ expense }: CrumbParams): Crumb[] => [{ label: expense?.name ?? "Kulu" }],
                },
              },
              {
                path: "new",
                element: <NewExpenseForm />,
                handle: {
                  crumb: () => [{ label: "Uusi kulu" }],
                },
              },
            ],
          },
          {
            path: "payment",
            handle: { crumb: () => [{ label: "Maksut" }] },
            children: [
              {
                path: ":paymentId",
                element: <EditPaymentForm />,
                handle: {
                  // TODO: Add optional description to payment
                  crumb: ({}: CrumbParams): Crumb[] => [{ label: "Maksu" }],
                },
              },
              {
                path: "new",
                element: <CreatePayments />,
                handle: {
                  crumb: () => [{ label: "Maksa velat" }],
                },
              },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to={"/"} replace /> },
    ],
  },
]);

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
