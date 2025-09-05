export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: Date
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    color: string;
    members: {
        user: User ;
        role: "admin" | "member" | "viewer" | "owner";
        joinedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Attachment {
    _id: string;
    filename: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: User | string ;
    uploadedAt: Date;
}

export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";
export enum ProjectMemberRole {
    Manager = "manager",
    Contributor = "contributor",
    Viewer = "viewer",
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    project: Project;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    dueDate: Date;
    priority: TaskPriority;
    assignee: User | string ;
    createdBy: User | string ;
    assignees: User[];
    subTasks?: Subtask[]; 
    watchers?: User[];
    attachments?: Attachment[];
}

export enum ProjectStatus {
    Planning = "Planning",
    InProgress = "In Progress",
    OnHold = "On Hold",
    Completed = "Completed",
    Cancelled = "Cancelled"
}

export interface Project {
    _id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    workspace: Workspace ;
    startDate: Date;
    dueDate: Date;
    progress: number;
    tasks: Task[]
    members: {
        user: User ;
        role: "admin" | "member" | "viewer" | "viewer";
        joinedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}

export interface MemberProps {
    _id: string;
    user: User;
    role: "admin" | "member" | "viewer" | "owner";
    joinedAt: Date;
}

export type ActionType = 
            "created_task" |
            "updated_task" |
            "created_subtask"|
            "updated_subtask"|
            "completed_task"|
            "created_project"|
            "updated_project"|
            "completed_project"|
            "created_workspace"|
            "updated_workspace"|
            "added_comment"|
            "added_member"|
            "removed_member"|
            "joined_workspace"|
            "transferred_workspace_ownership"|
            "added_attachment"

export type ResourceType = "Task" | "Project" | "Workspace" | "User" | "Comment"

export interface ActivityLog {
    _id: string
    user: User
    action: ActionType
    resourceType: ResourceType
    resourceId: string
    details: any
}

export interface CommentReaction {
    emoji: string
    user: User
}

export interface Comment {
    _id: string
    author: User
    text: string
    createdAt: Date
    reactions?: CommentReaction[]
    attachments?: {
        fileName: string
        fileUrl: string
        fileType?: string
        fileSize?: number 
    }[]
}

export interface StatsCardProps {
    totalProject: number;
    totalTask: number;
    totalProjectInProgress: number;
    totalProjectCompleted: number;
    totalTaskCompleted: number;
    totalTaskToDo: number;
    totalTaskInProgress: number;
}

export interface TaskTrendsData {
    name: string
    completed: number
    inProgress: number
    todo: number
}

export interface ProjectStatusData {
    name: string
    value: number
    color: string
}

export interface TaskPriorityData {
    name: string
    value: number
    color: string
}

export interface WorkspaceProductivityData {
    name: string
    completed: number
    total: number
}