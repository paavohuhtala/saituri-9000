import { Parser, Route, Response, route, router } from "typera-express";
import { DbType, NewExpenseGroup, NewExpenseGroupMember } from "../common/domain.js";
import {
  AddExpenseGroupResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  ExpenseGroupResponse,
  ExpenseGroupWithDetails,
  ExpenseGroupsResponse,
} from "../common/api.js";
import { prisma } from "./db.js";

const getAllExpenseGroups: Route<Response.Ok<DbType<ExpenseGroupsResponse>>> = route
  .get("/expense-groups")
  .handler(async () => {
    const expenseGroups = await prisma.expenseGroup.findMany({
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

  const expenseGroup = await prisma.expenseGroup.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          member: true,
        },
      },
      expenses: {
        include: {
          paidBy: true,
          participants: true,
        },
      },
      payments: {
        include: {
          payer: true,
        },
      },
    },
  });

  if (!expenseGroup) {
    return Response.notFound("Expense group not found");
  }

  const mappedGroup: DbType<ExpenseGroupResponse> = {
    ...expenseGroup,
    members: expenseGroup.members.map(({ member }) => member),
  };

  return Response.ok(mappedGroup);
});

const createExpenseGroup: Route<Response.Ok<AddExpenseGroupResponse> | Response.BadRequest<string>> = route
  .post("/expense-groups")
  .use(Parser.body(NewExpenseGroup))
  .handler(async (request) => {
    const { name } = request.body;

    const expenseGroup = await prisma.expenseGroup.create({
      data: {
        name,
      },
    });

    return Response.ok({ id: expenseGroup.id });
  });

const addExpenseGroupMember: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> = route
  .post("/expense-groups/:id/members")
  .use(Parser.body(NewExpenseGroupMember))
  .handler(async (request) => {
    const { id } = request.routeParams;
    const { memberId } = request.body;

    const expenseGroup = await prisma.expenseGroup.findUnique({
      where: {
        id,
      },
    });

    if (!expenseGroup) {
      return Response.notFound("Expense group not found");
    }

    await prisma.expenseGroupMember.create({
      data: {
        expenseGroupId: id,
        memberId,
      },
    });

    return Response.ok();
  });

const removeExpenseGroupMember: Route<Response.Ok<void> | Response.BadRequest<string> | Response.NotFound<string>> =
  route.delete("/expense-groups/:id/members/:memberId").handler(async (request) => {
    const { id, memberId } = request.routeParams;

    const expenseGroup = await prisma.expenseGroup.findUnique({
      where: {
        id,
      },
    });

    if (!expenseGroup) {
      return Response.notFound("Expense group not found");
    }

    await prisma.expenseGroupMember.delete({
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
  .use(Parser.body(CreateExpenseRequest))
  .handler(async (request) => {
    const { id: expenseGroupId } = request.routeParams;
    const { payerId: createdById, name, amount, participants } = request.body;

    const expenseGroup = await prisma.expenseGroup.findUnique({
      where: {
        id: expenseGroupId,
      },
    });

    if (!expenseGroup) {
      return Response.notFound("Expense group not found");
    }

    const { id } = await prisma.expense.create({
      data: {
        name,
        amount,
        expenseGroupId,
        payerId: createdById,
        participants: {
          create: participants.map((participant) => ({
            memberId: participant.id,
            weight: participant.weight,
          })),
        },
      },
    });

    return Response.ok({ id });
  });

export const expenseGroupApi = router(
  getAllExpenseGroups,
  getExpenseGroup,
  createExpenseGroup,
  addExpenseGroupMember,
  removeExpenseGroupMember,
  createExpense,
);
