import { $Enums } from "@/lib/generated/prisma";

type IssueStatusType = {
  name: string;
  key: $Enums.IssueStatus;
};

export const issueStatus: IssueStatusType[] = [
  {
    name: "Todo",
    key: $Enums.IssueStatus.TODO,
  },
  {
    name: "In Progress",
    key: $Enums.IssueStatus.IN_PROGRESS,
  },
  {
    name: "In Review",
    key: $Enums.IssueStatus.IN_REVIEW,
  },
  {
    name: "Done",
    key: $Enums.IssueStatus.DONE,
  },
];
