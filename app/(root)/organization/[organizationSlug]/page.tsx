import ProjectList from "@/app/_components/ProjectList";
import UserIssues from "@/app/_components/UserIssues";
import OrganizationSelector from "@/components/OrganizationSelector";
import { checkOrganization } from "@/lib/checkOrganization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Params = {
  params: {
    organizationSlug: string;
  };
};

const OrganizationPage = async ({ params }: Params) => {
  const { organizationSlug } = await params;

  // create the organization in db and send the clerk version back
  const organization = await checkOrganization(organizationSlug);
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!organization) {
    return <div>Organization Not Found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}'s Projects
        </h1>

        <OrganizationSelector />
      </div>

      <div>
        <ProjectList organizationId={organization.id} />
      </div>
      <div className="mt-8">
        <UserIssues userId={userId} />
      </div>
    </div>
  );
};

export default OrganizationPage;
