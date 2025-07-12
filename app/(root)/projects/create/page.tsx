"use client";

import OrganizationSelector from "@/components/OrganizationSelector";
import { useOrganization, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectInput, ProjectSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { createProject } from "@/actions/projects.actions";
import { IProject } from "@/types/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const CreateProjectPage = () => {
  const { isLoaded: isOrganizationLoader, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
  });

  useEffect(() => {
    if (isOrganizationLoader && membership && isUserLoaded) {
      setIsAdmin(membership.roleName === "Admin");
    }
  }, [isOrganizationLoader, isUserLoaded, membership]);

  const {
    data: project,
    loading,
    error,
    fn: createProjectFn,
  } = useFetch<IProject>(createProject);

  const onSubmit = async (data: ProjectInput) => {
    createProjectFn(data);
  };

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully");
      router.push(`/projects/${project.id}`);
    }
  }, [loading]);

  // org not selected and user not logged in
  if (!isOrganizationLoader || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center pt-20 gap-5">
        <span className="text-4xl gradient-title">
          Oops! Only admins can create projects.
        </span>
        <OrganizationSelector />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>

      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
          <Input
            id="name"
            placeholder="Give your project a name"
            className="text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-blue-300"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm mt-3 text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="bg-gray/5 backdrop-blur-md shadow-md transition rounded-xl border border-white/10 px-4 py-4">
          <Input
            id="key"
            placeholder="Short key to identify the project (e.g. CMS)"
            className="text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-blue-300"
            {...register("key")}
          />
          {errors.key && (
            <p className="text-sm mt-3 text-red-400">{errors.key.message}</p>
          )}
        </div>

        <div className="bg-gray/5 backdrop-blur-md shadow-md transition rounded-xl border border-white/10 px-4 py-4">
          <Textarea
            id="description"
            placeholder="What's this project about?"
            className="text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-blue-300 h-28"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm mt-3 text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex gap-4 pt-4">
            <Button
              type="reset"
              size="lg"
              variant="ghost"
              className="w-1/2 text-white border border-white/20 hover:bg-white/10"
            >
              Reset
            </Button>
            <Button
              disabled={loading}
              type="submit"
              size="lg"
              variant="default"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Create Project"
              )}
            </Button>
            {error && (
              <p className="text-sm mt-3 text-red-400">{error.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
