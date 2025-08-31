import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import WorkspaceAvatar from "@/components/workspace/workspace-avatar";
import { Plus, UserPlus } from "lucide-react";
import type { User, Workspace } from "types";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  members: {
    user: User;
    role: "admin" | "member" | "viewer" | "owner";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 p-6 border-b">
      {/* Main header section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Workspace info */}
          <div className="flex items-center gap-4">
            {workspace.color && (
              <WorkspaceAvatar
                color={workspace.color}
                name={workspace.name}
              />
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {workspace.name}
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onInviteMember}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite</span>
            </Button>
            <Button onClick={onCreateProject} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </div>

        {workspace.description && (
          <p className="text-gray-600 text-sm">{workspace.description}</p>
        )}
      </div>

      {/* Members section */}
      {members.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Members</span>
          <div className="flex items-center -space-x-2">
            {members.slice(0, 5).map((member, index) => (
              <Avatar
                key={index}
                title={member.user.name}
                className="border-2 border-white h-8 w-8"
              >
                <AvatarImage
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback className="text-xs">
                  {member.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <div className="bg-gray-100 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center text-xs border-2 border-white">
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};