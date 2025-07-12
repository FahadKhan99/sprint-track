import { getOrganization } from "@/actions/organizations.actions";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const checkOrganization = async (organizationSlug: string) => {
  try {
    const organization = await getOrganization(organizationSlug);

    if (!organization) {
      return null;
    }

    // ✅ Sync the organization to your database if not already present
    await prisma.organization.upsert({
      where: { clerkOrgId: organization.id },
      update: {},
      create: {
        clerkOrgId: organization.id,
        name: organization.name,
        slug: organization.slug ?? organization.id,
        organizationLogo: organization.imageUrl ?? "",
        ownerId: organization.createdBy || "",
      },
    });

    // fetch organization membership list from clerk
    const { data: membership } = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

    membership.map(async (member) => {
      if (!member.publicUserData?.userId) return;

      // update the organizationUser
      await prisma.organizationUser.upsert({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: member.publicUserData.userId,
          },
        },
        update: {
          role: member.role === "org:admin" ? "ADMIN" : "MEMBER",
        },
        create: {
          organizationId: organization.id,
          userId: member.publicUserData.userId,
          role: member.role === "org:admin" ? "ADMIN" : "MEMBER",
        },
      });
    });

    return organization;
  } catch (error) {
    console.log("Error creating organization: ", error);
    return null;
  }
};
