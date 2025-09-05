import React from 'react'
import type { TaskStatus } from 'types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUpdateTaskStatusMutation } from 'hooks/use-task';
import { toast } from 'sonner';

const TaskStatusSelector = ({status, taskId}: {status: TaskStatus; taskId: string}) => {

  const { mutate, isPending } = useUpdateTaskStatusMutation()
  const handleStatusChange = (value: string) => {
    mutate({taskId, status: value as TaskStatus}, 
      {
        onSuccess: () => {
          toast.success("Status updated Successfully")
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message
          toast.error(errorMessage)
          console.log(error)
        }
      }
    )
  }
  return (
    <Select value={status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='To Do'>To Do</SelectItem>
        <SelectItem value='In Progress'>In Progress</SelectItem>
        <SelectItem value='Done'>Done</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default TaskStatusSelector
