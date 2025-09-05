import {
    Building2,
    CheckCircle,
    CheckCircle2,
    CheckSquare,
    FileEdit,
    FolderEdit,
    FolderPlus,
    LogIn,
    MessageSquare,
    Send,
    Upload,
    UserMinus,
    UserPlus
} 
from "lucide-react";
import type { ActionType } from "types";

const renderIcon = (Icon: React.ElementType, bg: string, color: string) => (
    <div className={`${bg} p-2 rounded-md`}>
        <Icon className={`h-5 w-5 ${color} rounded-full`} />
    </div>
);

export const getActivityIcon = (action: ActionType) => {
    switch (action) {
        case "created_task":
        case "created_subtask":
            return renderIcon(CheckSquare, "bg-green-600/10", "text-green-600");

        case "updated_task":
        case "updated_subtask":
            return renderIcon(FileEdit, "bg-blue-600/10", "text-blue-600");

        case "completed_task":
            return renderIcon(CheckCircle, "bg-green-600/10", "text-green-600");

        case "created_project":
            return renderIcon(FolderPlus, "bg-blue-600/10", "text-blue-600");

        case "updated_project":
            return renderIcon(FolderEdit, "bg-blue-600/10", "text-blue-600");

        case "completed_project":
            return renderIcon(CheckCircle2, "bg-green-600/10", "text-green-600");

        case "created_workspace":
            return renderIcon(Building2, "bg-blue-600/10", "text-blue-600");

        case "added_comment":
            return renderIcon(MessageSquare, "bg-blue-600/10", "text-blue-600");

        case "added_member":
            return renderIcon(UserPlus, "bg-blue-600/10", "text-blue-600");

        case "removed_member":
            return renderIcon(UserMinus, "bg-red-600/10", "text-red-600");

        case "joined_workspace":
            return renderIcon(LogIn, "bg-blue-600/10", "text-blue-600");

        case "added_attachment":
            return renderIcon(Upload, "bg-blue-600/10", "text-blue-600");

        case "transferred_workspace_ownership":
            return renderIcon(Send, "bg-blue-600/10", "text-blue-600");

        default:
            return null;
    }
};
