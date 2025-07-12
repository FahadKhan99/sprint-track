import { IssuePriority, IssueStatus } from "@/types/types";
import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is Required")
    .max(100, "Name must be 100 characters or less"),
  key: z
    .string()
    .min(2, "Key must be atleast 2 characters")
    .max(10, "Key must be 10 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
});

export const SprintSchema = z.object({
  name: z
    .string()
    .min(1, "Name is Required")
    .max(100, "Name must be 100 characters or less"),
  startDate: z.date(),
  endDate: z.date(),
});

export const IssueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(50, "Description must atleast be 50 characters or more"),
  status: z.nativeEnum(IssueStatus),
  priority: z.nativeEnum(IssuePriority),
  assigneeId: z.string().min(1, "Please select Assignee"),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type SprintInput = z.infer<typeof SprintSchema>;
export type IssueInput = z.infer<typeof IssueSchema>;
