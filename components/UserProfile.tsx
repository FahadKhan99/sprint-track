"use client";

import { UserButton } from "@clerk/nextjs";
import { Building } from "lucide-react";

const UserProfile = () => {
  return (
    <div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "!w-10 !h-10",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            href="/onboarding"
            label="My organization"
            labelIcon={<Building size={15} />}
          />

          <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};

export default UserProfile;
