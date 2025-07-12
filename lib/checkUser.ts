import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Upsert the user — create if not exist, else do nothing (update: {})
    const newUser = await prisma.user.upsert({
      where: { clerkUserId: user.id },
      update: {},
      create: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error checking user and adding: ", error);
  }
};
