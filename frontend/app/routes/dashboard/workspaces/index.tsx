import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { CreateWorkspace } from "@/components/workspace/create-workspace"
import { useGetWorkspacesQuery } from "hooks/use-workspace"
import { PlusCircle, Users } from "lucide-react"
import { useState } from "react"
import type { Workspace } from "types"
import NoDataFound from "./nodata-found"
import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WorkspaceAvatar from "@/components/workspace/workspace-avatar"
import { format } from "date-fns"

const Workspaces = () => {
    const [isCreatingWorkspaces, setIsCreatingWorkspaces] = useState(false)
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data: Workspace[]
        isLoading: boolean
    }

    if (isLoading) return <Loader />

    return (
        <>
            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Workspaces</h2>

                    <Button onClick={() => setIsCreatingWorkspaces(true)} className="w-full sm:w-auto">
                        <PlusCircle className="size-4 mr-2" />
                        New Workspace
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {workspaces.map((w) => (
                        <WorkspaceCard key={w._id} workspace={w} />
                    ))}

                    {workspaces.length === 0 && (
                        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                            <NoDataFound
                                title="No Workspace found"
                                description="Create a new workspace to get started"
                                buttonText="Create Workspace"
                                buttonAction={() => setIsCreatingWorkspaces(true)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspaces}
                setIsCreatingWorkspace={setIsCreatingWorkspaces}
            />
        </>
    )
}

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}/projects`}>
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold leading-tight">{workspace.name}</CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Users className="size-4 mr-1" />
                            <span className="text-xs font-medium">{workspace.members.length}</span>
                        </div>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2 text-sm">
                        {workspace.description || "No description"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 text-sm text-muted-foreground">
                    View workspace details and projects
                </CardContent>
            </Card>
        </Link>
    )
}

export default Workspaces
