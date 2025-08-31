import Loader from "@/components/ui/loader"
import { useGetWorkspaceQuery } from "hooks/use-workspace"
import { useState } from "react"
import { useParams } from "react-router"
import type { Project, Workspace } from "types"
import { WorkspaceHeader } from "./workspace-header"
import { ProjectList } from "./project-list"
import CreateProjectDialog from "@/components/projects/create-project-dialog"

const WorkspaceDetails = () => {
    const {workspaceId} = useParams()
    const [ isCreatingProject, setIsCreatingProject ] = useState(false)
    const [ isInviteMember, setIsInviteMember ] = useState(false)

    if(!workspaceId) return <div>No Workspace found</div>

    const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
        data : {
          workspace: Workspace
          projects: Project[]
        }
        isLoading: boolean
    }
 
    if(isLoading) return <div> <Loader /> </div>

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data?.workspace?.members}
        onCreateProject={() => setIsCreatingProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />


      <ProjectList
        workspaceName={data.workspace.name}
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreatingProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreatingProject}
        onOpenChange={setIsCreatingProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />
    </div>
  )
}

export default WorkspaceDetails
