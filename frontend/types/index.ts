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
    isCompleted: boolean;
    createdAt: Date;
}

export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

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