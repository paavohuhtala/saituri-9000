import type { GroupWithUsers, GroupWithDetails, DbType } from "../../common/domain.js";
import type { BackendContext } from "../context.js";

export async function createGroup({ db }: BackendContext, { name }: { name: string }): Promise<string> {
  const { id } = await db.group.create({ data: { name } });
  return id;
}

const whereUserInGroup = (userId: string) => ({ users: { some: { id: { equals: userId } } } }) as const;

export async function getGroupAsUser(
  { db }: BackendContext,
  { groupId, userId }: { groupId: string; userId: string },
): Promise<GroupWithUsers | null> {
  const group = await db.group.findUnique({
    include: { users: true },
    where: { id: groupId, ...whereUserInGroup(userId) },
  });
  return group;
}

export async function getGroupWithDetailsAsUser(
  { db }: BackendContext,
  { groupId, userId }: { groupId: string; userId: string },
): Promise<DbType<GroupWithDetails> | null> {
  const group = await db.group.findUnique({
    where: { id: groupId, ...whereUserInGroup(userId) },
    include: {
      users: true,
      members: true,
      expenseGroups: true,
    },
  });

  return group;
}
