"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const OnBoarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    } else {
      // Redirect to the onboarding page if no organization is found
      router.push("/onboarding");
    }
  }, [organization, router]);
  return (
    <div className="flex items-center justify-center pt-40">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
};

export default OnBoarding;
