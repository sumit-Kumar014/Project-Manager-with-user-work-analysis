import { LayoutDashboard, Briefcase, CheckSquare, Users, Trophy, Settings, LogOut, Wrench, ChevronsRight, ChevronsLeft } from "lucide-react"
import { useAuth } from "provider/auth-context"
import { useState } from "react"
import type { Workspace } from "types"
import { Link, useLocation, useNavigate } from "react-router"   // ✅ added useLocation for active state
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "../ui/scroll-area"

const Sidebar = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
    const { user } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()   // get current path
    const navigate = useNavigate()

    const navItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Workspaces", href: "/workspaces", icon: Briefcase },
        { title: "My Tasks", href: "/my-tasks", icon: CheckSquare },
        { title: "Members", href: "/members", icon: Users },
        { title: "Archieved", href: "/archived-tasks", icon: Trophy },
        { title: "Settings", href: "/settings", icon: Settings }
    ]

    return (
        <div className={`h-screen bg-white border-r flex flex-col justify-between transition-all duration-300 shadow-sm ${isCollapsed ? "w-16" : "w-60"}`}>
            <div>
                {/* Collapse Toggle */}
                <div className="flex h-14 items-center px-4 border-b mb-3">
                    <Link to='/dashboard' className="flex items-center">
                        {!isCollapsed && (
                            <div className="flex items-center gap-2">
                                <Wrench className="size-6 text-blue-600" />
                                <span className="font-semibold text-lg tracking-tight">TaskTribe</span>
                            </div>
                        )}
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto hover:bg-gray-100 rounded-xl" 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
                    </Button>
                </div>

                {/* SidebarNav */}
                <ScrollArea className="flex-1 px-2 py-2">
                    <nav className={`flex flex-col gap-y-1 ${isCollapsed ? "items-center" : "items-start"}`}>
                        {navItems.map(({ title, href, icon: Icon }) => {
                            const isActive = location.pathname === href   
                            const handleclick = () => {
                                if(href === "/workspaces") navigate(href)
                                else if(currentWorkspace && currentWorkspace._id) navigate(`${href}?workspaceId=${currentWorkspace._id}`)
                                else navigate(href)
                            }
                            return (
                                <Button 
                                    key={href} 
                                    variant={isActive ? "outline" : "ghost"}
                                    className={`
                                        w-full flex items-center rounded-xl m-1.5 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
                                        ${isCollapsed ? "justify-center" : "justify-start"}
                                        ${isActive ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-700 hover:bg-gray-50"}
                                    `}  
                                    onClick={handleclick}
                                >
                                    <Icon className={`shrink-0 ${isCollapsed ? "" : "mr-2"} size-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                                    {!isCollapsed && <span>{title}</span>}
                                </Button>
                            )
                        })}
                    </nav>
                </ScrollArea>
            </div>

            {/* User showcase*/}
            <div className="p-4 border-t">
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                    {user?.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt="User avatar"
                            className="w-9 h-9 rounded-full ring-2 ring-gray-200"
                        />
                    ) : (
                        <Avatar className="w-9 h-9 ring-2 ring-gray-200">
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback className="bg-blue-600 text-white text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
