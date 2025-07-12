"use server";

import prisma from "@/lib/prisma";
import { ProjectInput } from "@/lib/validators";
import { IProject } from "@/types/types";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const createProject = async (data: ProjectInput): Promise<IProject> => {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // check if the user belongs to the orgainzation that they are fetching
  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // check to see if the user exists inside the membership array or not
  const userMembership = membership.find(
    (member) => userId === member.publicUserData?.userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization's admin can create projects");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        key: data.key,
        organizationId: orgId,
        ownerId: userId,
      },
    });

    return project;
  } catch (error) {
    console.log("Error Creating Project: ", error);
    throw new Error("Failed to create project");
  }
};

export const getAllProjectByOrganizationId = async (organizationId: string) => {
  const { userId } = await auth();

  if (!userId) {
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
    const projects = await prisma.project.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    });

    if (!organization) {
      throw new Error("No Organization found");
    }

    return { projects, organization };
  } catch (error: any) {
    console.log("Error fetching all projects: ", error);
    throw new Error(error.message);
  }
};

export const deleteProject = async (projectId: string) => {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete project.");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it."
    );
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true };
  } catch (error: any) {
    console.log("Error deleting project: ", error);
    throw new Error(error.message);
  }
};

export const getProjectById = async (projectId: string) => {
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
      include: {
        sprints: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    // verify project belong to current organization
    if (project.organizationId !== orgId) return null;

    return project;
  } catch (error: any) {
    console.log("Error fetching single project: ", error);
    throw new Error(error.message);
  }
};
