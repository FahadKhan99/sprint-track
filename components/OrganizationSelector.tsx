"use client";

import {
  useOrganization,
  useUser,
  SignedIn,
  OrganizationSwitcher,
} from "@clerk/nextjs";

import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import { Button } from "./ui/button";

const OrganizationSelector = () => {
  const { isLoaded: isOrganizationLoader } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (!isOrganizationLoader || !isUserLoaded) {
    <div className="min-w-[160px] h-[40px]" />;
  }

  const isOnboarding = pathname === "/onboarding";

  return (
    <div>
      <SignedIn>
        <Button
          size="lg"
          variant="outline"
          className="border-2 px-8 py-5 rounded-md text-white"
        >
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/organization/:slug"
            afterSelectOrganizationUrl="/organization/:slug"
            {...(isOnboarding
              ? {
                  createOrganizationMode: "navigation",
                  createOrganizationUrl: "/onboarding",
                }
              : { createOrganizationMode: "modal" })}
            appearance={{
              elements: {
                organizationSwitcherTrigger:
                  "border border-gray-300 px-5 py-3 rounded-md",
                organizationSwitcherTriggerIcon: "text-white",
              },
            }}
          />
        </Button>
      </SignedIn>
    </div>
  );
};

export default OrganizationSelector;
