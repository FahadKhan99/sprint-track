import { $Enums } from "@/lib/generated/prisma";

export type IUser = {
  id: string;
  email: string;
  name: string | null;
  clerkUserId: string;
  imageUrl: string | null;

  // assignedIssues: IIssue[];
  // createdIssues: IIssue[];
  // projects: IProject[];

  createdAt: Date;
  updatedAt: Date;
};

export type IOrganization = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  slug: string;
  organizationLogo: string;
};

export type IProject = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  organizationId: string;
  ownerId: string;

  // owner?: IUser;
  // sprints?: ISprint[];
  // issues?: IIssue[];

  createdAt: Date;
  updatedAt: Date;
};

export enum SprintStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PLANNED = "PLANNED",
}

// change back to ?
export type ISprint = {
  id: string;
  name: string;
  startDate: Date;
  capacity: number | null;
  completedAt: Date | null;
  createdBy: string | null;
  endDate: Date;
  status: $Enums.SprintStatus;
  projectId: string;

  // issues: IIssue[];

  createdAt: Date;
  updatedAt: Date;
};

export enum IssueStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export type IIssue = {
  id: string;
  title: string;
  description: string;
  order: number;
  status: $Enums.IssueStatus;
  priority: $Enums.IssuePriority;
  reporterId: string;
  assigneeId: string;
  projectId: string;
  sprintId: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type IssueWithAssignee = IIssue & {
  assignee: IUser;
  reporter: IUser;
};

export type IssueWithProject = IssueWithAssignee & {
  project: IProject;
};
