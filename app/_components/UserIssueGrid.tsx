"use client";

import { IssueWithProject } from "@/types/types";
import IssueCard from "./IssueCard";

const UserIssueGrid = ({ issues }: { issues: IssueWithProject[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onDelete={() => {}}
          onUpdate={() => {}}
          showStatusBadge
        />
      ))}
    </div>
  );
};

export default UserIssueGrid;
