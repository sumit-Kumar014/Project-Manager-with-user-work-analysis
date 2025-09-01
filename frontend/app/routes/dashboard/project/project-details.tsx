import Loader from "@/components/ui/loader"
import { getProjectProgress } from "@/lib"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import type { Project, Task, TaskStatus } from "types"
import { BackButton } from "../workspaces/back-button"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useProjectQuery } from "hooks/use-projects"
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string
    workspaceId: string
  }>()

  const navigate = useNavigate()

  const [isCreateTask, setIsCreateTask] = useState(false)
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All")

  const { data, isLoading } = useProjectQuery(projectId!) as {
    data: {
      project: Project
      tasks: Task[];
    }
    isLoading: boolean
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader /></div>
  }

  const { project, tasks } = data
  const projectProgress = getProjectProgress(tasks)

  const handleTaskClick = (taskId: string) => {
    navigate(`/workspaces/${workspaceId}/${projectId}/tasks/${taskId}`)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <BackButton />
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3 min-w-32">
            <div className="text-sm text-muted-foreground whitespace-nowrap">Progress:</div>
            <div className="flex-1 min-w-[120px]">
              <Progress value={projectProgress} className="h-2 rounded-full" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{projectProgress}%</span>
          </div>
          <Button className="rounded-xl px-4 py-2 shadow-sm" onClick={() => setIsCreateTask(true)}>+ Add Task</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <TabsList className="flex flex-wrap justify-center lg:justify-start">
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>All</TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>To Do</TabsTrigger>
              <TabsTrigger value="in-progress" onClick={() => setTaskFilter("In Progress")}>In Progress</TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>Done</TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2 text-sm justify-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline" className="bg-background">{tasks.filter((t) => t.status === "To Do").length} To Do</Badge>
              <Badge variant="outline" className="bg-background">{tasks.filter((t) => t.status === "In Progress").length} In Progress</Badge>
              <Badge variant="outline" className="bg-background">{tasks.filter((t) => t.status === "Done").length} Done</Badge>
            </div>
          </div>

          {/* All tasks (kanban style) */}
          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          {/* Individual filters (single column layout) */}
          <TabsContent value="todo" className="m-0">
            <TaskColumn
              title="To Do"
              tasks={tasks.filter((task) => task.status === "To Do")}
              onTaskClick={handleTaskClick}
              isFullWidth
            />
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <TaskColumn
              title="In Progress"
              tasks={tasks.filter((task) => task.status === "In Progress")}
              onTaskClick={handleTaskClick}
              isFullWidth
            />
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <TaskColumn
              title="Done"
              tasks={tasks.filter((task) => task.status === "Done")}
              onTaskClick={handleTaskClick}
              isFullWidth
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  )
}

export default ProjectDetails

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  isFullWidth?: boolean
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false
}: TaskColumnProps) => {
  return (
    <div className={isFullWidth ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : ""}>
      <div className={cn("space-y-5", !isFullWidth ? "h-full" : "col-span-full mb-4")}>
        {!isFullWidth && (
          <div className="flex items-center justify-center gap-2 pb-2 border-b">
            <h1 className="font-semibold text-lg">{title}</h1>
            <Badge variant="outline" className="bg-background">{tasks.length}</Badge>
          </div>
        )}
        <div className={cn("space-y-3", isFullWidth && "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6")}>
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8 border rounded-lg">
              No Task Yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card 
      onClick={onClick} 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl border border-gray-200"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={
            task.priority === "High"
              ? "bg-red-500 text-white"
              : task.priority === "Medium"
                ? "bg-orange-500 text-white"
                : "bg-slate-500 text-white"
          }>
            {task.priority}
          </Badge>
          <div className="flex gap-1">
            {task.status !== "To Do" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); console.log("Mark as To Do") }}
                title="Mark as To Do"
              >
                <AlertCircle className="size-4" />
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); console.log("Mark as In Progress") }}
                title="Mark as In Progress"
              >
                <Clock className="size-4" />
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 hover:bg-muted"
                onClick={(e) => { e.stopPropagation(); console.log("Mark as Done") }}
                title="Mark as Done"
              >
                <CheckCircle className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <h4 className="font-semibold text-base">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    title={member.name}
                    key={member._id}
                    className="size-8 border-2 border-background shadow-sm"
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 5 && (
                  <span className="text-xs text-muted-foreground pl-2">
                    +{task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
          {task.dueDate && (
            <div className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
              <Calendar className="size-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>
        {task.subTasks && task.subTasks.length > 0 && (
          <div className="pt-1 text-xs text-muted-foreground">
            {task.subTasks.filter((s) => s.isCompleted).length}/{task.subTasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  )
}
