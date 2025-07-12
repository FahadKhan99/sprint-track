"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { $Enums } from "@/lib/generated/prisma";
import { IssueWithAssignee } from "@/types/types";
import UserAvatar from "./UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { deleteIssueById, updateIssue } from "@/actions/issues.actions";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";

interface Props {
  issue: IssueWithAssignee;
  showStatusBadge?: boolean;
  onDelete: () => void;
  onUpdate: (issue: IssueWithAssignee) => void;
}

const priorityColor: Record<$Enums.IssuePriority, string> = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  CRITICAL: "border-red-400",
};

const priorityColorBg: Record<$Enums.IssuePriority, string> = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-300",
  HIGH: "bg-orange-400",
  CRITICAL: "bg-red-400",
};
const priorityColorText: Record<$Enums.IssuePriority, string> = {
  LOW: "text-white",
  MEDIUM: "text-black",
  HIGH: "text-black",
  CRITICAL: "text-black",
};

// for status
const statusColorBg: Record<$Enums.IssueStatus, string> = {
  TODO: "bg-zinc-600",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-indigo-300",
  DONE: "bg-emerald-500",
};

const statusColorText: Record<$Enums.IssueStatus, string> = {
  TODO: "text-white",
  IN_PROGRESS: "text-white",
  IN_REVIEW: "text-black",
  DONE: "text-white",
};

const IssueCard = ({
  issue,
  showStatusBadge = false,
  onDelete,
  onUpdate,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<$Enums.IssueStatus>(issue.status);
  const [priority, setPriority] = useState<$Enums.IssuePriority>(
    issue.priority
  );
  const { user } = useUser();
  const { membership } = useOrganization();
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });
  const router = useRouter();
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith("/projects/");

  const { loading, data, fn: deleteIssueByIdFn } = useFetch(deleteIssueById);

  const {
    loading: updateIssueLoading,
    data: updatedIssue,
    fn: updateIssueFn,
  } = useFetch(updateIssue);

  const canChange =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  // const handleDelete = (...params: []) => {
  //   router.refresh();
  //   onDelete(...params);
  // };

  // const handleUpdate = (...params: []) => {
  //   router.refresh();
  //   onUpdate(...params);
  // };

  const handleStatusChange = (newStatus: $Enums.IssueStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = (newPriority: $Enums.IssuePriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
  };

  const handleDeleteIssue = () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueByIdFn(issue.id);
    }
  };

  useEffect(() => {
    if (data) {
      setIsDialogOpen(false);
      onDelete(); // call parent method
    }

    if (updatedIssue) {
      onUpdate(updatedIssue); // call parent method
    }
  }, [data, updatedIssue, loading, updateIssueLoading]);

  return (
    <>
      <Card
        className={`border-t-2 ${
          priorityColor[issue.priority]
        } rounded-lg cursor-pointer hover:shadow-2xl`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium">{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          {showStatusBadge && (
            <Badge
              className={`${statusColorBg[issue.status]} ${
                statusColorText[issue.status]
              }`}
            >
              {issue.status}
            </Badge>
          )}
          <Badge
            className={`-ml-1 ${priorityColorText[issue.priority]} ${
              priorityColorBg[issue.priority]
            }`}
          >
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />
          <span className="text-sm text-muted-foreground">
            Created {created}
          </span>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="space-y-4 bg-gray-900 text-muted-foreground overflow-y-scroll">
            <DialogHeader>
              <div className="flex items-center w-full">
                <DialogTitle className="text-lg text-foreground">
                  {issue.title}
                </DialogTitle>
                {!isProjectPage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      router.push(
                        `/projects/${issue.projectId}/?sprintId=${issue.sprintId}`
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogHeader>

            {(loading || updateIssueLoading) && (
              <BarLoader width="100%" color="#36d7b7" className="rounded" />
            )}

            <div className="space-y-4">
              {/* Status Dropdown */}
              <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-white/80"
                >
                  Status
                </label>
                <Select
                  disabled={loading || updateIssueLoading}
                  value={status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value={$Enums.IssueStatus.TODO}>
                      To do
                    </SelectItem>
                    <SelectItem value={$Enums.IssueStatus.IN_REVIEW}>
                      In Review
                    </SelectItem>
                    <SelectItem value={$Enums.IssueStatus.IN_PROGRESS}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={$Enums.IssueStatus.DONE}>
                      Done
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Dropdown */}
              <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
                <label
                  htmlFor="priority"
                  className="block mb-2 text-sm font-medium text-white/80"
                >
                  Priority
                </label>
                <Select
                  disabled={loading || updateIssueLoading}
                  value={priority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    <SelectItem value={$Enums.IssuePriority.LOW}>
                      Low
                    </SelectItem>
                    <SelectItem value={$Enums.IssuePriority.MEDIUM}>
                      Medium
                    </SelectItem>
                    <SelectItem value={$Enums.IssuePriority.HIGH}>
                      High
                    </SelectItem>
                    <SelectItem value={$Enums.IssuePriority.CRITICAL}>
                      Critical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white/80"
                >
                  Description
                </label>

                <div className="rounded-md border border-white/10 bg-muted px-3 py-2 max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
                  <MDEditor.Markdown
                    source={
                      issue.description
                        ? issue.description
                        : "_No description provided._"
                    }
                    className="prose prose-invert max-w-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="reporter"
                      className="block mb-2 text-sm font-medium text-white/80"
                    >
                      Reporter
                    </label>
                    <UserAvatar user={issue.reporter} />
                  </div>
                  <div>
                    <label
                      htmlFor="assignee"
                      className="block mb-2 text-sm font-medium text-white/80"
                    >
                      Assignee
                    </label>
                    <UserAvatar user={issue.assignee} />
                  </div>
                </div>

                {canChange && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteIssue}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete Issue"}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default IssueCard;
