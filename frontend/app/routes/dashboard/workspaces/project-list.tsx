import type { Project } from "types";
import NoDataFound from "./nodata-found";
import ProjectCard from "../../../components/projects/project-card";

interface ProjectListProps {
    workspaceName: string;
    workspaceId: string;
    projects: Project[]
    onCreateProject: () => void;
}

export const ProjectList = ({ workspaceId, projects, onCreateProject, workspaceName }: ProjectListProps) => {
    return (
        <div>
            <h3 className="text-xl font-medium mb-4 ml-2">Projects of <span className="font-bold text-blue-500">{workspaceName}</span> workspace</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {
                    projects.length === 0 ? (
                        <NoDataFound
                            title="No Projects found"
                            description="Create a project to manage your tasks and collaborate with your team."
                            buttonText="Create Project"
                            buttonAction={onCreateProject}
                        />
                    ) : (
                        projects.map((project) => {
                            const projectProgress = 0
                            return (
                            <ProjectCard key={project._id} project={project} progress={projectProgress} workspaceId={workspaceId} />
                        )})
                    )
                }
            </div>
        </div>
    )
}

