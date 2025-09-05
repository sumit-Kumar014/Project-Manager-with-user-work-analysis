import type { Project } from "types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {


  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card
        className="transition-all duration-300 hover:shadow-md hover:translate-y-1 cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <span
              className={cn(
                "text-xs rounded-full",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm gap-2 text-muted-foreground">
                <span>{Array.isArray(project.tasks) ? project.tasks.length : 0}</span>
                <span>Tasks</span>
              </div>
              {project.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  <span>{format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
