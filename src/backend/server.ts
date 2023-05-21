import bodyParser from "body-parser";
import express from "express";
import { PrismaClient } from "../../db/generated/client/index.js";
import { Parser, Route, Response, route, router } from "typera-express";
import { DbType, NewExpenseGroup } from "../common/domain.js";
import { ExpenseGroupResponse, ExpenseGroupWithDetails, ExpenseGroupsResponse } from "../common/api.js";

const port = process.env.BACKEND_PORT ?? 3001;

const server = express();

server.use(bodyParser.json());

const prisma = new PrismaClient();

server.get("/", (req, res) => {
  res.send("OK");
});

const getAllExpenseGroups: Route<Response.Ok<DbType<ExpenseGroupsResponse>>> = route
  .get("/expense-groups")
  .handler(async () => {
    const expenseGroups = await prisma.expenseGroup.findMany({
      include: {
        members: true,
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const mappedGroups: DbType<ExpenseGroupWithDetails>[] = expenseGroups.map(({ _count, ...rest }) => ({
      ...rest,
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
      members: true,
      expenses: {
        include: {
          createdBy: true,
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

  return Response.ok(expenseGroup);
});

const createExpenseGroup: Route<Response.Ok<{ id: string }> | Response.BadRequest<string>> = route
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

const expenseGroupApi = router(getAllExpenseGroups, getExpenseGroup, createExpenseGroup);

server.use("/api", expenseGroupApi.handler());

server.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});
