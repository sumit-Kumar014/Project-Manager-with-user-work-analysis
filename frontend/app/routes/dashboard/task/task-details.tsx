import Loader from "@/components/ui/loader";
import {
  useArchivedTaskMuation,
  UseTaskByIdQuery,
  useWatchTaskMutation,
} from "hooks/use-task";
import { useAuth } from "provider/auth-context";
import { useNavigate, useParams } from "react-router";
import type { Project, Task } from "types";
import { BackButton } from "../workspaces/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash } from "lucide-react";
import TaskTitle from "@/components/task/task-title";
import { formatDistanceToNow } from "date-fns";
import TaskStatusSelector from "@/components/task/task-status-selector";
import { TaskDescription } from "@/components/task/task-description";
import TaskAssigneesSelector from "@/components/task/task-assignees-selector";
import TaskPrioritySelector from "@/components/task/task-priority-selector";
import { SubTaskDetails } from "@/components/task/sub-tasks";
import { Watchers } from "@/components/task/watchers";
import TaskActivity from "@/components/task/task-activity";
import CommentSection from "@/components/task/comment-section";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading } = UseTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: archivedTask, isPending: isArchived } =
    useArchivedTaskMuation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task Not Found</div>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task Watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleArchivedTask = () => {
    archivedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task Archived");
        },
        onError: () => {
          toast.error("Failed to archive task");
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">{task.title}</h1>
          {task.isArchived && (
            <Badge className="ml-2" variant="outline">
              Archived
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchTask}
            disabled={isWatching}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unwatch
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Watch
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchivedTask}
            disabled={isArchived}
          >
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-md border">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <Badge
                  className="mb-2 capitalize"
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                      ? "default"
                      : "outline"
                  }
                >
                  {task.priority} Priority
                </Badge>
                <TaskTitle title={task.title} taskId={task._id} />
                <div className="text-xs text-muted-foreground mt-1">
                  Created{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TaskStatusSelector status={task.status} taskId={task._id} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <TaskDescription
                taskId={task._id}
                description={task.description || ""}
              />
            </div>

            {/* Assignees */}
            <div className="mt-4">
              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={project.members as any}
              />
            </div>

            {/* Priority Selector */}
            <div className="mt-4">
              <TaskPrioritySelector
                priority={task.priority}
                taskId={task._id}
              />
            </div>

            {/* Sub Tasks */}
            <div className="mt-4">
              <SubTaskDetails
                subTasks={task.subTasks || []}
                taskId={task._id}
              />
            </div>
          </div>

          {/* Comments */}
          <CommentSection taskId={task._id} members={project.members as any} />
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Watchers watchers={task.watchers || []} />
          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
