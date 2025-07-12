"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";

const Loading = () => {
  const { isLoaded: isOrganizationLoading } = useOrganization();
  const { isLoaded: isUserLoading } = useUser();

  if (!isOrganizationLoading || !isUserLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  } else <></>;
};

export default Loading;
