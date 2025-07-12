"use server";

import prisma from "@/lib/prisma";
import { SprintInput } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";

export const createSprint = async (projectId: string, data: SprintInput) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.organizationId != orgId) {
      throw new Error("Project Not Found");
    }

    const sprint = await prisma.sprint.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        projectId,
        status: "PLANNED",
      },
    });

    return sprint;
  } catch (error: any) {
    console.log("Error Creating sprint: ", error);
    throw new Error(error.message);
  }
};

export const updateSprintStatus = async (
  sprintId: string,
  newStatus: "ACTIVE" | "COMPLETED" | "PLANNED"
) => {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only admins can make this change!");
  }

  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    // prevent user -> if user is changing status of "COMPLETED"
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only COMPLETE an ACTIVE sprint");
    }

    // finnally update
    const updatedSprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        status: newStatus,
      },
    });

    return updatedSprint;
  } catch (error: any) {
    console.log("Error updating sprint status: ", error);
    throw new Error(error.message);
  }
};
