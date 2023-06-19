import { Parser, Route, Response, route, router, Middleware, Router } from "typera-express";
import { DbType, NewExpenseGroup, NewExpenseGroupMember } from "../common/domain.js";
import {
  AddExpenseGroupResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  ExpenseGroupResponse,
  ExpenseGroupWithDetails,
  ExpenseGroupsResponse,
} from "../common/api.js";
import { calculateBalanceMatrix } from "../common/share.js";
import { BackendContext } from "./context.js";

export function createExpenseGroupApi({ db }: BackendContext): Router {
  const getAllExpenseGroups: Route<Response.Ok<DbType<ExpenseGroupsResponse>>> = route
    .get("/expense-groups")
    .handler(async () => {
      const expenseGroups = await db.expenseGroup.findMany({
        include: {
          members: {
            include: {
              member: true,
            },
          },
          _count: {
            select: { expenses: true },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const mappedGroups: DbType<ExpenseGroupWithDetails>[] = expenseGroups.map(({ _count, members, ...rest }) => ({
        ...rest,
        members: members.map(({ member }) => member),
        expenseCount: _count.expenses,
      }));

      return Response.ok(mappedGroups);
    });

  const getExpenseGroup: Route<
    Response.Ok<DbType<ExpenseGroupResponse>> | Response.BadRequest<string> | Response.NotFound<string>
  > = route.get("/expense-groups/:id").handler(async (request) => {
    const { id } = request.routeParams;

    const expenseGroup = await db.expenseGroup.findUnique({
      where: {
        id,
      },
      include: {
        members: {
          include: {
            member: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        expenses: {
          include: {
            paidBy: true,
            participants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payments: {
          include: {
            payer: true,
            payee: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!expenseGroup) {
      return Response.notFound("Expense group not found");
    }

    const mappedGroup = {
      ...expenseGroup,
      members: expenseGroup.members.map(({ member }) => member),
    };

    const response: DbType<ExpenseGroupResponse> = {
      ...mappedGroup,
      balanceMatrix: calculateBalanceMatrix(mappedGroup),
    };

    return Response.ok(response);
  });

  const createExpenseGroup: Route<Response.Ok<AddExpenseGroupResponse> | Response.BadRequest<string>> = route
    .post("/expense-groups")
    .use(Parser.body(NewExpenseGroup))
    .handler(async (request) => {
      const { name } = request.body;

      const expenseGroup = await db.expenseGroup.create({
        data: {
          name,
        },
      });

      return Response.ok({ id: expenseGroup.id });
    });

  const addExpenseGroupMember: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> =
    route
      .post("/expense-groups/:id/members")
      .use(Parser.body(NewExpenseGroupMember))
      .handler(async (request) => {
        const { id } = request.routeParams;
        const { memberId } = request.body;

        const expenseGroup = await db.expenseGroup.findUnique({
          where: {
            id,
          },
        });

        if (!expenseGroup) {
          return Response.notFound("Expense group not found");
        }

        await db.expenseGroupMember.create({
          data: {
            expenseGroupId: id,
            memberId,
          },
        });

        return Response.ok();
      });

  const ensureExpenseGroupExists: Middleware.ChainedMiddleware<
    { routeParams: { id: string } },
    unknown,
    Response.NotFound<string>
  > = async ({ routeParams: { id } }) => {
    const expenseGroup = await db.expenseGroup.findUnique({
      where: {
        id,
      },
    });

    if (!expenseGroup) {
      return Middleware.stop(Response.notFound("Expense group not found"));
    }

    return Middleware.next();
  };

  const removeExpenseGroupMember: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> =
    route
      .delete("/expense-groups/:id/members/:memberId")
      .use(ensureExpenseGroupExists)
      .handler(async (request) => {
        const { id, memberId } = request.routeParams;

        await db.expenseGroupMember.delete({
          where: {
            expenseGroupId_memberId: {
              expenseGroupId: id,
              memberId,
            },
          },
        });

        return Response.ok();
      });

  const createExpense: Route<
    Response.Ok<CreateExpenseResponse> | Response.BadRequest<string> | Response.NotFound<string>
  > = route
    .post("/expense-groups/:id/expenses")
    .use(ensureExpenseGroupExists)
    .use(Parser.body(CreateExpenseRequest))
    .handler(async (request) => {
      const { id: expenseGroupId } = request.routeParams;
      const { payerId, name, amount, participants } = request.body;

      const { id } = await db.expense.create({
        data: {
          name,
          amount,
          expenseGroupId,
          payerId,
          participants: {
            create: participants.map((participant) => ({
              memberId: participant.memberId,
              weight: participant.weight,
            })),
          },
        },
      });

      return Response.ok({ id });
    });

  const updateExpense: Route<
    Response.Ok<CreateExpenseResponse> | Response.BadRequest<string> | Response.NotFound<string>
  > = route
    .put("/expense-groups/:id/expenses/:expenseId")
    .use(ensureExpenseGroupExists)
    .use(Parser.body(CreateExpenseRequest))
    .handler(async (request) => {
      const { expenseId } = request.routeParams;
      const { payerId, name, amount, participants } = request.body;

      const expense = await db.expense.findUnique({
        where: {
          id: expenseId,
        },
      });

      if (!expense) {
        return Response.notFound("Expense not found");
      }

      await db.expense.update({
        where: {
          id: expenseId,
        },
        data: {
          name,
          amount,
          payerId,
          participants: {
            deleteMany: {},
            create: participants.map((participant) => ({
              memberId: participant.memberId,
              weight: participant.weight,
            })),
          },
        },
      });

      return Response.ok({ id: expenseId });
    });

  const deleteExpense: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> = route
    .delete("/expense-groups/:id/expenses/:expenseId")
    .use(ensureExpenseGroupExists)
    .handler(async (request) => {
      const { expenseId } = request.routeParams;

      await db.expense.delete({
        where: {
          id: expenseId,
        },
      });

      return Response.ok();
    });

  const createPayment: Route<
    Response.Ok<CreatePaymentResponse> | Response.BadRequest<string> | Response.NotFound<string>
  > = route
    .post("/expense-groups/:id/payments")
    .use(ensureExpenseGroupExists)
    .use(Parser.body(CreatePaymentRequest))
    .handler(async (request) => {
      const { id: expenseGroupId } = request.routeParams;
      const { payerId, amount, payeeId } = request.body;

      const { id } = await db.payment.create({
        data: {
          amount,
          expenseGroupId,
          payerId,
          payeeId,
        },
      });

      return Response.ok({ id });
    });

  const updatePayment: Route<
    Response.Ok<CreatePaymentResponse> | Response.BadRequest<string> | Response.NotFound<string>
  > = route
    .put("/expense-groups/:id/payments/:paymentId")
    .use(ensureExpenseGroupExists)
    .use(Parser.body(CreatePaymentRequest))
    .handler(async (request) => {
      const { paymentId } = request.routeParams;
      const { payerId, amount, payeeId } = request.body;

      const payment = await db.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      if (!payment) {
        return Response.notFound("Payment not found");
      }

      await db.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          amount,
          payerId,
          payeeId,
        },
      });

      return Response.ok({ id: paymentId });
    });

  const deletePayment: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> = route
    .delete("/expense-groups/:id/payments/:paymentId")
    .use(ensureExpenseGroupExists)
    .handler(async (request) => {
      const { paymentId } = request.routeParams;

      await db.payment.delete({
        where: {
          id: paymentId,
        },
      });

      return Response.ok();
    });

  const expenseGroupApi = router(
    getAllExpenseGroups,
    getExpenseGroup,
    createExpenseGroup,

    addExpenseGroupMember,
    removeExpenseGroupMember,

    createExpense,
    updateExpense,
    deleteExpense,

    createPayment,
    updatePayment,
    deletePayment,
  );

  return expenseGroupApi;
}
