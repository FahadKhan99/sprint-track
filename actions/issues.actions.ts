"use server";

import { $Enums } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { IssueInput } from "@/lib/validators";
import { IssueWithAssignee } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export const createIssue = async (
  projectId: string,
  sprintId: string,
  data: IssueInput
) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const lastIssue = await prisma.issue.findFirst({
      where: { projectId, status: data.status },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        projectId,
        priority: data.priority,
        sprintId,
        reporterId: user.clerkUserId,
        assigneeId: data.assigneeId,
        order: newOrder,
      },
    });

    return { success: true, issue };
  } catch (error: any) {
    console.log("Error creating issue: ", error);
    throw new Error(error.message);
  }
};

export const getAllIssuesBySprintId = async (sprintId: string) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    // fetch all issues
    const issues = await prisma.issue.findMany({
      where: { sprintId },
      orderBy: [{ status: "asc" }, { order: "asc" }], // see model @@index
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return { success: true, issues };
  } catch (error: any) {
    console.log("Error fetching all issues: ", error);
    throw new Error(error.message);
  }
};

export const updateIssueOrderAndStatus = async (
  newIssues: IssueWithAssignee[]
) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    // await prisma.$transaction(async (prisma) => {
    //   for (const issue of newIssues) {
    //     await prisma.issue.update({
    //       where: { id: issue.id },
    //       data: {
    //         status: issue.status,
    //         order: issue.order,
    //       },
    //     });
    //   }
    // });

    // this will return a promise but will not perform the query
    const updateOperations = newIssues.map((issue) =>
      prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      })
    );

    // this will perform the set of queries -> this is better than the commented out code above
    await prisma.$transaction(updateOperations);

    return { success: true };
  } catch (error: any) {
    console.log("Error updating  all issues: ", error);
    throw new Error(error.message);
  }
};

export const deleteIssueById = async (issueId: string) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    // get the issue
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: true,
      },
    });

    if (!issue) {
      throw new Error("Issue not Found");
    }

    // either creator of issue or the project owner can delete a issue
    if (
      issue.reporterId !== user.clerkUserId &&
      issue.project.ownerId !== user.clerkUserId
    ) {
      throw new Error("You don't have permission to delete the issue");
    }

    await prisma.issue.delete({ where: { id: issue.id } });

    return { success: true };
  } catch (error: any) {
    console.log("Error deleting issue: ", error);
    throw new Error(error.message);
  }
};

export const updateIssue = async (
  issueId: string,
  data: { status: $Enums.IssueStatus; priority: $Enums.IssuePriority }
) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: true,
      },
    });

    if (!issue) {
      throw new Error("Issue not Found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    // update the issue
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        reporter: true,
        assignee: true,
      },
    });

    return updatedIssue;
  } catch (error: any) {
    console.log("Error updating issue: ", error);
    throw new Error(error.message);
  }
};

// clerkUserId
export const getUserIssues = async (userId: string) => {
  try {
    const { orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const issues = await prisma.issue.findMany({
      where: {
        OR: [{ assigneeId: userId }, { reporterId: userId }],
        project: {
          organizationId: orgId,
        },
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return issues;
  } catch (error: any) {
    console.log("Error fetching issues getUserIssues: ", error);
    throw new Error(error.message);
  }
};
