import type { WorkspaceForm } from "@/components/workspace/create-workspace"
import { getData, postData } from "@/lib/fetch-utils"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data)
    })
}

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => getData("/workspaces")
    })
}

export const useGetWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => getData(`/workspaces/${workspaceId}/projects`),
    })
}

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "stats"],
        queryFn: async () => getData(`/workspaces/${workspaceId}/stats`),
    })
}

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => getData(`/workspaces/${workspaceId}`),
  });
};

export const useGetWorkspaceInviteDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspaceInvite", workspaceId],
    queryFn: async () => await getData(`/workspaces/${workspaceId}/invite`),
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};