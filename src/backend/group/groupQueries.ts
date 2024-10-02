import { DateTime, Duration } from "luxon";
import type { GroupWithUsers, GroupWithDetails, DbType, GroupInviteWithDetails, Group } from "../../common/domain.js";
import type { BackendContext } from "../context.js";
import type { GroupInvite } from "../../../db/generated/client/index.js";
import type { AcceptGroupInviteError } from "../../common/api.js";
import { Result } from "../../common/result.js";

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

export async function getGroupsAsUser({ db }: BackendContext, { userId }: { userId: string }): Promise<Group[]> {
  const groups = await db.group.findMany({
    where: whereUserInGroup(userId),
  });
  return groups;
}

const INVITE_VALIDITY_DURATION = Duration.fromObject({ hours: 2 });

export async function createGroupInvite(
  { db }: BackendContext,
  { groupId, creatorUserId }: { groupId: string; creatorUserId: string },
): Promise<GroupInvite | undefined> {
  const expiresAt = DateTime.now().plus(INVITE_VALIDITY_DURATION);

  // We don't validate group membership here - the caller should have already done that

  const invite = await db.groupInvite.create({
    data: { groupId, expiresAt: expiresAt.toISO(), createdById: creatorUserId },
  });
  return invite;
}

export async function getGroupInvite(
  { db }: BackendContext,
  { inviteId }: { inviteId: string },
): Promise<DbType<GroupInviteWithDetails> | null> {
  const invite = await db.groupInvite.findUnique({
    where: { id: inviteId },
    include: { group: { select: { name: true } }, createdBy: { select: { name: true } } },
  });

  if (!invite) {
    return null;
  }

  return {
    id: invite.id,
    groupId: invite.groupId,
    expiresAt: invite.expiresAt,
    groupName: invite.group.name,
    inviterName: invite.createdBy.name,
  };
}

export type AcceptGroupInviteResult = Result<{ groupId: string }, AcceptGroupInviteError>;

export async function acceptGroupInvite(
  { db, logger }: BackendContext,
  { inviteId, userId }: { inviteId: string; userId: string },
): Promise<AcceptGroupInviteResult> {
  try {
    const invite = await db.groupInvite.findUnique({ where: { id: inviteId } });

    if (!invite) {
      logger.warn({ inviteId, userId }, "Tried to accept non-existent group invite");
      return Result.error("invite-not-found");
    }

    const expiresAt = DateTime.fromJSDate(invite.expiresAt);

    if (expiresAt.diffNow().milliseconds < 0) {
      logger.warn({ inviteId, userId }, "Tried to accept expired group invite");
      return Result.error("invite-expired");
    }

    await db.group.update({
      where: { id: invite.groupId },
      data: { users: { connect: { id: userId } } },
    });

    return Result.ok({ groupId: invite.groupId });
  } catch (err) {
    logger.error({ err, inviteId, userId }, "Unknown error accepting group invite");
    return Result.error("unknown-error");
  }
}
