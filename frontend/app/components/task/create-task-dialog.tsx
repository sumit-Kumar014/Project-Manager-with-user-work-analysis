import { createTaskSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask } from "hooks/use-task";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProjectMemberRole, User } from "types";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTask();

  const onSubmit = (data: CreateTaskFormData) => {
    mutate(
      { projectId, taskData: data },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          onOpenChange(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
          console.error(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Task
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Title</FormLabel>
                    <FormControl>
                      <input
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter task title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[100px] rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter task description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Status & Priority */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Due Date
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start rounded-xl border border-gray-300 px-3 py-2 text-sm font-normal shadow-sm ${
                            !field.value ? "text-gray-400" : "text-gray-800"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "PPPP")
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="rounded-xl border border-gray-200 shadow-lg">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString() || undefined)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Assignees */}
              <FormField
                control={form.control}
                name="assignees"
                render={({ field }) => {
                  const selected = field.value || [];
                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Assignees
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-xl border border-gray-300 px-3 py-2 text-sm font-normal shadow-sm min-h-11"
                          >
                            {selected.length === 0 ? (
                              <span className="text-gray-400">
                                Select assignees
                              </span>
                            ) : selected.length <= 2 ? (
                              selected
                                .map((id) => {
                                  const member = projectMembers.find(
                                    (m) => m.user._id === id
                                  );
                                  return member?.user.name;
                                })
                                .join(", ")
                            ) : (
                              `${selected.length} assignees selected`
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-sm max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                          align="start"
                        >
                          <div className="flex flex-col gap-2">
                            {projectMembers.map((mem) => {
                              const checked = selected.includes(mem.user._id);
                              return (
                                <div
                                  key={mem.user._id}
                                  className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(c) => {
                                      if (c) {
                                        field.onChange([
                                          ...selected,
                                          mem.user._id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          selected.filter(
                                            (m) => m !== mem.user._id
                                          )
                                        );
                                      }
                                    }}
                                    id={`member-${mem.user._id}`}
                                  />
                                  <span className="truncate text-sm">
                                    {mem.user.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-70"
              >
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
