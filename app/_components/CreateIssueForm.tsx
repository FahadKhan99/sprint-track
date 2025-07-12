import { createIssue } from "@/actions/issues.actions";
import { getOrganizationUsers } from "@/actions/organizations.actions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { IssueInput, IssueSchema } from "@/lib/validators";
import { IssuePriority, IssueStatus } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: IssueStatus;
  projectId: string;
  organizationId: string;
  sprintId: string;
  onIssueCreated: () => void;
}

const CreateIssueForm = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  organizationId,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: IssuePriority.LOW,
      status: IssueStatus.TODO,
      assigneeId: "",
    },
  });

  const {
    loading: issueLoading,
    error,
    fn: createIssueFn,
  } = useFetch(createIssue);

  const {
    loading: orgUsersLoading,
    data: organizationUsers,
    fn: getOrganizationUsersFn,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    (async () => {
      if (isOpen && organizationId) {
        await getOrganizationUsersFn(organizationId);
      }
    })();
  }, [organizationId, isOpen]);

  const onSubmit = async (data: IssueInput) => {
    try {
      const response = await createIssueFn(projectId, sprintId, data);
      if (response?.success && response.issue) {
        toast.success("Issue created successfully");
        reset();
        onClose();
        onIssueCreated(); // parent call -> re fetches issues
      }
    } catch (error) {
      console.log("Error creating issue (frontend): ", error);
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-gray-900 text-gray-300">
        <DrawerHeader>
          <DrawerTitle className="text-2xl mt-3">Create New Issue</DrawerTitle>
        </DrawerHeader>
        {orgUsersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form
          className="flex flex-col space-y-4 mb-4 mt-3 px-20 overflow-y-scroll"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-white/80"
            >
              Issue Title
            </label>
            <Input
              id="title"
              placeholder="Short Summary."
              className="text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-blue-300"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm mt-3 text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-white/80"
            >
              Detailed Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <MDEditor
                    className="h-28"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            {errors.description && (
              <p className="text-sm mt-3 text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
            <label
              htmlFor="assigneeId"
              className="block mb-2 text-sm font-medium text-white/80"
            >
              Assign To
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => {
                return (
                  <div className="">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Assignee" />
                      </SelectTrigger>
                      <div className="w-full">
                        <SelectContent>
                          {organizationUsers?.map((user) => (
                            <SelectItem key={user.id} value={user.clerkUserId}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </div>
                    </Select>
                  </div>
                );
              }}
            />
            {errors.assigneeId && (
              <p className="text-sm mt-3 text-red-400">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
            <label
              htmlFor="priority"
              className="block mb-2 text-sm font-medium text-white/80"
            >
              Priority Level
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <div className="w-full">
                      <SelectContent>
                        <SelectItem value={IssuePriority.LOW}>Low</SelectItem>
                        <SelectItem value={IssuePriority.MEDIUM}>
                          Medium
                        </SelectItem>
                        <SelectItem value={IssuePriority.HIGH}>High</SelectItem>
                        <SelectItem value={IssuePriority.CRITICAL}>
                          Critical
                        </SelectItem>
                      </SelectContent>
                    </div>
                  </Select>
                );
              }}
            />
          </div>

          <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-white/80"
            >
              Issue Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    disabled
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Set Status" />
                    </SelectTrigger>
                    <div className="w-full">
                      <SelectContent>
                        <SelectItem value={IssueStatus.TODO}>To do</SelectItem>
                        <SelectItem value={IssueStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                        <SelectItem value={IssueStatus.IN_PROGRESS}>
                          In progress
                        </SelectItem>
                        <SelectItem value={IssueStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </div>
                  </Select>
                );
              }}
            />
          </div>

          {error && (
            <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
              <p className="text-red-400">{error.message}</p>
            </div>
          )}

          <div className="py-3">
            <Button
              type="submit"
              disabled={issueLoading}
              size="lg"
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {issueLoading ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssueForm;
