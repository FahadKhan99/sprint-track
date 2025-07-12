"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient, Organization } from "@clerk/nextjs/server";

export const getOrganization = async (organizationSlug: string) => {
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
    throw new Error("User Not Found!");
  }

  const organization = await (
    await clerkClient()
  ).organizations.getOrganization({
    slug: organizationSlug,
  });

  if (!organization) {
    return null;
  }

  // check if the user belongs to the orgainzation that they are fetching
  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: organization.id,
  });

  // check to see if the user exists inside the membership array or not
  const userMembership = membership.find(
    (member) => user.clerkUserId === member.publicUserData?.userId
  );

  if (!userMembership) {
    return null; // dont return org
  }

  return organization;
};

export const getOrganizationUsers = async (organizationId: string) => {
  try {
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
      throw new Error("User Not Found!");
    }

    // check if
    if (organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const organizationMembers = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId,
    });

    const userIds = organizationMembers.data
      .map((member) => member?.publicUserData?.userId)
      .filter((userId): userId is string => userId !== undefined);

    // Check if there are no userIds
    if (!userIds || userIds.length < 1) {
      throw new Error("No organization users found");
    }

    // Fetch organization users from the database
    const organizationUsers = await prisma.user.findMany({
      where: { clerkUserId: { in: userIds } },
    });

    return organizationUsers;
  } catch (error: any) {
    console.log("Error fetching organization users: ", error);
    throw new Error(error.message);
  }
};
