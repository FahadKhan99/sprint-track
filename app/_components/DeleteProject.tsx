"use client";

import { deleteProject } from "@/actions/projects.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFetch from "@/hooks/useFetch";
import { useOrganization } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectId: string;
  
}

const DeleteProject = ({ projectId }: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const router = useRouter();

  const {
    loading: deleting,
    error,
    fn: deleteProjectFn,
  } = useFetch(deleteProject);

  const handleDelete = async () => {
    try {
      await deleteProjectFn(projectId);
      toast.error("Project deleted successfully");
      router.refresh(); // revalidate and refresh the current page
      setIsConfirmOpen(false);
    } catch (error) {
      console.log("Error deleting project [frontend]", error);
    }
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Delete project"
          disabled={deleting}
          className={`${deleting ? "animate-pulse" : ""}`}
        >
          <Trash size={24} className="text-red-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-muted-foreground">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className={`${deleting ? "animate-pulse" : ""}`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProject;
