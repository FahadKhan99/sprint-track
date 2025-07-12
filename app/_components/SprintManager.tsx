"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISprint } from "@/types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprints.actions";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSprint: ISprint;
  onSprintChange: Dispatch<SetStateAction<ISprint>>;
  sprints: ISprint[];
  projectId: string;
}

const SprintManager = ({
  currentSprint,
  onSprintChange,
  sprints,
  projectId,
}: Props) => {
  const [currentSprintStatus, setCurrentSprintStatus] = useState(
    currentSprint.status
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const now = new Date();

  const canStartSprint =
    isBefore(now, currentSprint.endDate) &&
    isAfter(now, currentSprint.startDate) &&
    currentSprint.status === "PLANNED";

  const canEndSprint = currentSprint.status === "ACTIVE";

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((sprint) => sprint.id === value);

    if (selectedSprint) {
      onSprintChange(selectedSprint);
      setCurrentSprintStatus(selectedSprint.status);
      // remove query params
      router.replace(window.location.pathname);
    }
  };

  const getStatusText = () => {
    if (currentSprintStatus === "COMPLETED") {
      return "Sprint Ended";
    } else if (
      currentSprintStatus === "ACTIVE" &&
      isAfter(now, currentSprint.endDate)
    ) {
      return `Overdue by ${formatDistanceToNow(currentSprint.endDate)}`;
    } else if (
      currentSprintStatus === "PLANNED" &&
      isBefore(now, currentSprint.startDate)
    ) {
      return `Starts in ${formatDistanceToNow(currentSprint.startDate)}`;
    } else return "";
  };

  const {
    data: updatedSprint,
    loading,
    fn: updateSprintStatusFn,
  } = useFetch(updateSprintStatus);

  const handleSprintStatusChange = async (
    newSprintStatus: "ACTIVE" | "COMPLETED" | "PLANNED"
  ) => {
    try {
      await updateSprintStatusFn(currentSprint.id, newSprintStatus);

      // this coming from useFetch
      if (updatedSprint) {
        toast.success(
          `Sprint status has been updated to "${newSprintStatus}".`
        );

        setCurrentSprintStatus(newSprintStatus);
        onSprintChange({
          ...currentSprint,
          status: updatedSprint.status,
        });
      }
    } catch (error) {
      console.log("Error updating sprint status: ", error);
    }
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprintId");

    if (sprintId && sprintId !== currentSprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        onSprintChange(selectedSprint);
        setCurrentSprintStatus(selectedSprint.status);
      }
    }
  }, [searchParams.toString(), sprints]);
  return (
    <>
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Sprint Selector */}
        <div className="flex-1 bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10">
          <Select value={currentSprint.id} onValueChange={handleSprintChange}>
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="Select Sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map((sprint) => (
                <SelectItem
                  key={sprint.id}
                  value={sprint.id}
                  textValue={sprint.name}
                >
                  <div className="flex items-center gap-x-4">
                    <span className="font-medium text-sm">{sprint.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(sprint.startDate, "MMM d, yyyy")} &mdash;{" "}
                      {format(sprint.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {canStartSprint && (
            <Button
              className="bg-green-700 text-white hover:bg-green-800"
              onClick={() => handleSprintStatusChange("ACTIVE")}
              disabled={loading}
            >
              Start Sprint
            </Button>
          )}
          {canEndSprint && (
            <Button
              variant="destructive"
              onClick={() => handleSprintStatusChange("COMPLETED")}
              disabled={loading}
            >
              End Sprint
            </Button>
          )}
        </div>
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}

      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
