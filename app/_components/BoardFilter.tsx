"use client";

import { Input } from "@/components/ui/input";
import { IssueWithAssignee, IUser } from "@/types/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  issues: IssueWithAssignee[];
  onFilterChange: (newFilteredIssues: IssueWithAssignee[]) => void;
}

const BoardFilter = ({ issues, onFilterChange }: Props) => {
  const [searchIssue, setSearchIssue] = useState<string>("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] =
    useState<$Enums.IssuePriority | null>(null);

  // finding all the unique assignees
  const assignees: IUser[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < issues.length; i++) {
    const assignee = issues[i].assignee;

    // check for duplicate
    if (!seenIds.has(assignee.id)) {
      assignees.push(assignee);
      seenIds.add(assignee.id);
    }
  }

  const isFilterApplied =
    searchIssue.trim() !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== null;

  const handleClearFilter = () => {
    setSearchIssue("");
    setSelectedAssignees([]);
    setSelectedPriority(null);
  };

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssignees((prev) => {
      if (prev.includes(assigneeId)) {
        // remove if already selected
        return prev.filter((id) => id !== assigneeId);
      } else {
        // add if not selected
        return [...prev, assigneeId];
      }
    });
  };

  useEffect(() => {
    const filteredIssues: IssueWithAssignee[] = issues.filter((issue) => {
      // the null checks are there to return all issues if no issues provided
      const matchesSearch =
        searchIssue.trim() === "" ||
        issue.title.toLowerCase().includes(searchIssue.trim().toLowerCase());

      const matchesPriority =
        selectedPriority === null || issue.priority === selectedPriority;

      const matchesAssignee =
        selectedAssignees.length === 0 ||
        selectedAssignees.includes(issue.assignee.id);

      return matchesSearch && matchesPriority && matchesAssignee;
    });

    console.log({ filteredIssues });

    // call the parent
    onFilterChange(filteredIssues);
  }, [searchIssue, selectedAssignees, selectedPriority, issues]);

  return (
    <div className="flex items-center">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-6 pr-2 ">
        <div className="bg-gray/5 backdrop-blur-md shadow-sm transition">
          <Input
            placeholder="Search Issuee..."
            value={searchIssue}
            onChange={(e) => setSearchIssue(e.target.value)}
            className="w-full sm:w-72"
          />
        </div>

        <div className="flex-shrink-0">
          <div
            className="relative"
            style={{
              height: "40px",
              width: `${(assignees.length - 1) * 20 + 40}px`,
            }}
          >
            {assignees.map((assignee, index) => {
              const selected = selectedAssignees.includes(assignee.id);
              return (
                <div
                  key={index}
                  className={`absolute rounded-full ring-2 ${
                    selected ? "ring-blue-600" : "ring-black"
                  }`}
                  style={{ left: `${index * 20}px` }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={assignee?.imageUrl ?? undefined}
                      alt={assignee?.name || "Assignee avatar"}
                    />
                    <AvatarFallback className="capitalize">
                      {assignee?.name?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-x-4 bg-gray/5 backdrop-blur-md shadow-sm transition ">
          <Select
            value={selectedPriority ?? ""}
            onValueChange={(newPriority: $Enums.IssuePriority) =>
              setSelectedPriority(newPriority)
            }
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
              <SelectItem value={$Enums.IssuePriority.LOW}>Low</SelectItem>
              <SelectItem value={$Enums.IssuePriority.MEDIUM}>
                Medium
              </SelectItem>
              <SelectItem value={$Enums.IssuePriority.HIGH}>High</SelectItem>
              <SelectItem value={$Enums.IssuePriority.CRITICAL}>
                Critical
              </SelectItem>
            </SelectContent>
          </Select>

          {isFilterApplied && (
            <Button
              variant="ghost"
              onClick={handleClearFilter}
              className="flex items-center"
            >
              <X className=" h-4 w-4" /> Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardFilter;
