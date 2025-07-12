"use client";

import { IIssue, ISprint, IssueStatus, IssueWithAssignee } from "@/types/types";
import { useEffect, useState } from "react";
import SprintManager from "./SprintManager";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { issueStatus } from "@/constants/issueStatus";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssueForm from "./CreateIssueForm";
import useFetch from "@/hooks/useFetch";
import {
  getAllIssuesBySprintId,
  updateIssueOrderAndStatus,
} from "@/actions/issues.actions";
import { BarLoader } from "react-spinners";
import IssueCard from "./IssueCard";
import { $Enums } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { off } from "process";
import BoardFilter from "./BoardFilter";

interface Props {
  sprints: ISprint[];
  projectId: string;
  organizationId: string;
}

const SprintBoard = ({ organizationId, projectId, sprints }: Props) => {
  const [currentSprint, setCurrentSprint] = useState<ISprint>(
    sprints.find((sprint: ISprint) => sprint.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(
    IssueStatus.TODO
  );

  const [issues, setIssues] = useState<IssueWithAssignee[]>([]);
  const [filteredIssues, setFilteredIssues] = useState(issues);

  const handleFilterChange = (newFilteredIssues: IssueWithAssignee[]) => {
    setFilteredIssues(newFilteredIssues);
  };

  const {
    loading,
    data,
    error: errorLoadingIssues,
    fn: getAllIssuesBySprintIdFn,
  } = useFetch(getAllIssuesBySprintId);

  const {
    loading: updateIssueLoading,
    data: updateIssueData,
    error: errorUpdatingIssue,
    fn: updateIssueOrderAndStatusFn,
  } = useFetch(updateIssueOrderAndStatus);

  useEffect(() => {
    const fetch = async () => {
      await getAllIssuesBySprintIdFn(currentSprint.id);
    };

    fetch();
  }, [currentSprint.id]);

  useEffect(() => {
    if (data?.issues) {
      setIssues(data.issues);
    }
  }, [data]);

  const reorder = (
    issue: IssueWithAssignee[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(issue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update the board");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }

    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // no move
    }

    const updatedIssues = [...issues];

    // group issues by columns
    const sourceIssues = updatedIssues
      .filter((issue) => issue.status === source.droppableId)
      .sort((a, b) => a.order - b.order);

    const destinationIssues = updatedIssues
      .filter((issue) => issue.status === destination.droppableId)
      .sort((a, b) => a.order - b.order);

    // Filter issues that belong to this column
    const columnIssues = updatedIssues
      .filter((issue) => issue.status === source.droppableId)
      .sort((a, b) => a.order - b.order);

    const draggedIssue = sourceIssues[source.index];

    // handle reorder within the same column
    if (source.droppableId === destination.droppableId) {
      // droppableId is columns basically
      const reordered = reorder(columnIssues, source.index, destination.index); // index are rows

      // Update order values and reflect back into updatedIssues
      reordered.forEach((item, index) => {
        item.order = index;
      });

      // Map updated columnIssues back into updatedIssues
      const newIssues = updatedIssues.map((issue) => {
        const updated = reordered.find((r) => r.id === issue.id);
        return updated ? { ...issue, order: updated.order } : issue;
      });

      setIssues(newIssues);
      updateIssueOrderAndStatusFn(newIssues);
    } else {
      // moving across columns

      // remove from source
      sourceIssues.splice(source.index, 1);

      // insert into destination
      destinationIssues.splice(destination.index, 0, {
        ...draggedIssue,
        status: destination.droppableId as IssueStatus,
      });

      // reorder the source and destination
      sourceIssues.forEach((issue, index) => {
        issue.order = index;
      });
      destinationIssues.forEach((issue, index) => {
        issue.order = index;
      });

      // Apply the changes to full list
      const newIssues = updatedIssues.map((issue) => {
        const updatedFromSource = sourceIssues.find((i) => i.id === issue.id);
        const updatedFromDestination = destinationIssues.find(
          (i) => i.id === issue.id
        );

        if (updatedFromDestination) {
          return {
            ...issue,
            order: updatedFromDestination.order,
            status: destination.droppableId as IssueStatus,
          };
        }

        if (updatedFromSource) {
          return {
            ...issue,
            order: updatedFromSource.order,
          };
        }

        return issue;
      });

      setIssues(newIssues);
      updateIssueOrderAndStatusFn(newIssues);
    }
  };

  // this will change the current status that this is being dragged from.
  // allow open a drawer to create a issue
  const handleCreateIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = async () => {
    await getAllIssuesBySprintIdFn(currentSprint.id);
  };

  if (errorLoadingIssues) {
    return <div>Error Fetching issues</div>;
  }

  return (
    <div>
      {/* sprint manager -> selecting and activating a sprint */}
      <SprintManager
        currentSprint={currentSprint}
        onSprintChange={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* filter */}
      {issues && !loading && (
        <BoardFilter issues={issues} onFilterChange={handleFilterChange} />
      )}

      {(loading || updateIssueLoading) && (
        <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />
      )}

      {/* kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-xl">
          {issueStatus.map((status) => (
            <Droppable key={status.key} droppableId={status.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {status.name}
                  </h3>

                  {/* issues */}
                  {filteredIssues
                    .filter((issue) => issue.status === status.key)
                    .sort((a, b) => a.order - b.order)
                    .map((issue, index) => (
                      <Draggable
                        key={index}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssueLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={() =>
                                getAllIssuesBySprintIdFn(currentSprint.id)
                              }
                              onUpdate={(updatedIssue) =>
                                setIssues((prev) =>
                                  prev.map((issue) =>
                                    issue.id === updatedIssue.id
                                      ? updatedIssue
                                      : issue
                                  )
                                )
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                  {status.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          handleCreateIssue(status.key as IssueStatus)
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <CreateIssueForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        organizationId={organizationId}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
      />
    </div>
  );
};

export default SprintBoard;
