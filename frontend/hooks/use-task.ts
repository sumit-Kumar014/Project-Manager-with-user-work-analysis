import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { postData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateTask = () => {
    const queryCLient = useQueryClient()

    return useMutation({
        mutationFn: (data: { projectId: string; taskData: CreateTaskFormData}) => 
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data: any) => {
            queryCLient.invalidateQueries({ queryKey: ['projects', data.project] })
        }
    })
}