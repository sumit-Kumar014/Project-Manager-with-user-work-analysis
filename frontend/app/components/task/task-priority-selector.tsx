import type { TaskPriority } from 'types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUpdateTaskPriorityMutation, useUpdateTaskStatusMutation } from 'hooks/use-task';
import { toast } from 'sonner';

const TaskPrioritySelector = ({priority, taskId}: {priority: TaskPriority; taskId: string}) => {

  const { mutate, isPending } = useUpdateTaskPriorityMutation()
  const handleStatusChange = (value: string) => {
    mutate({taskId, priority: value as TaskPriority}, 
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
    <Select value={priority || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='Low'>Low</SelectItem>
        <SelectItem value='Medium'>Medium</SelectItem>
        <SelectItem value='High'>High</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default TaskPrioritySelector
