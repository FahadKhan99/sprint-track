"use client";

import { Button } from "@/components/ui/button";
import { SprintInput, SprintSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addDays, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import useFetch from "@/hooks/useFetch";
import { createSprint } from "@/actions/sprints.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}

const CreateSprintForm = ({
  projectId,
  projectKey,
  projectTitle,
  sprintKey,
}: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control, // use to handle third party (eg. date picker)
  } = useForm({
    resolver: zodResolver(SprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const {
    data: sprint,
    loading,
    fn: createSprintFn,
    error,
  } = useFetch<SprintInput>(createSprint);

  const onSubmit = async (data: SprintInput) => {
    try {
      await createSprintFn(projectId, {
        ...data,
        startDate: dateRange.from,
        endDate: dateRange.to,
      });
      toast.success("Sprint created successfully");
      router.refresh();
      setShowForm(false);
    } catch (error) {
      console.log("Error creating sprint (Frontend): ", error);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="gradient-title text-5xl font-bold mb-8">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={`${showForm ? "destructive" : "default"}`}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      {showForm && (
        <form
          className="flex flex-col space-y-4 mb-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex space-x-3 items-end">
            <div className="w-1/2 bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition  border border-white/10 px-4 py-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-white/80"
              >
                Name
              </label>
              <Input
                id="name"
                readOnly
                className="text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-blue-300"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm mt-3 text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="w-1/2 bg-gray/5 backdrop-blur-md rounded-xl shadow-sm transition border border-white/10 px-4 py-4">
              <label
                htmlFor="startDate"
                className="block mb-2 text-sm font-medium text-white/80"
              >
                Sprint Duration
              </label>

              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-white bg-gray-900 border border-white/10 hover:bg-gray-800"
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-white/70" />
                        {dateRange.from && dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} —{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          <span className="text-white/50">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      className=" w-auto p-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-100"
                    >
                      <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDateRange(range as { from: Date; to: Date });
                            field.onChange(range);
                          }
                        }}
                        className="rounded-md bg-gray-900 text-white p-3 shadow-lg z-100"
                        modifiersClassNames={{
                          selected: "bg-blue-600 text-white",
                          range_start: "bg-blue-700 text-white rounded-l-md",
                          range_end: "bg-blue-700 text-white rounded-r-md",
                          range_middle: "bg-blue-600/30 text-white",
                          today: "border border-white/20",
                          outside: "text-gray-500 opacity-50",
                          disabled: "text-gray-600 line-through",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="py-3" >
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Creating..." : "Create Sprint"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateSprintForm;
