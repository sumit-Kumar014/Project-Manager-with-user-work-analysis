import { useAuth } from "provider/auth-context";
import type { Workspace } from "types"
import { Button } from "../ui/button";
import { Bell, LogOut, PlusCircle, Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";
import Loader from "../ui/loader";

interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
    selectedWorkspace: Workspace | null;
    onCreatedWorkspace: () => void
}

const Header = ({ onWorkspaceSelected, selectedWorkspace, onCreatedWorkspace }: HeaderProps) => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { workspaces } = useLoaderData() as { workspaces: Workspace[] }
    
    const isOnWorkspacePage = useLocation().pathname.includes("/workspace")
    
    const handleOnClick = (workspace: Workspace) => {
        onWorkspaceSelected(workspace)
        const location = window.location
        if(isOnWorkspacePage) {
            navigate(`/workspaces/${workspace._id}/projects`)
        } else {
            const basePath = location.pathname
            navigate(`${basePath}?workspaceId=${workspace._id}`) 
        }
    }
    
    if (!workspaces) return <Loader />

    return (
        <div className="bg-background sticky top-0 z-40 border-b" >
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline'>
                            {selectedWorkspace ? (
                                <>
                                    {
                                        selectedWorkspace.color && <WorkspaceAvatar color={selectedWorkspace.color} name={selectedWorkspace.name} />
                                    }
                                    <span className="font-medium" >{selectedWorkspace?.name}</span>
                                </>
                            ) : (
                                <span className="font-medium">Select Workspace</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {workspaces.map((w) => {
                                return (
                                    <DropdownMenuItem key={w._id} onClick={() => handleOnClick(w)}>
                                        {w.color && (
                                            <WorkspaceAvatar color={w.color} name={w.name} />
                                        )}
                                        <span className="ml-2">{w.name}</span>
                                    </DropdownMenuItem>
                                )
                            })}

                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreatedWorkspace} >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Create workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    <Button className="cursor-pointer text-blue-600" variant='ghost' size='icon'>
                        <Bell />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full border p-1 cursor-pointer">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="text-black" />
                                <Link to='/user/profile' >Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} >
                                <LogOut className="text-black" />
                                Log Out
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Star className="text-black" />
                                Upgrade
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

        </div>
    )
}

export default Header
