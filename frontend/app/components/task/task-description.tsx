import { useUpdateTaskDescriptionMutation } from "hooks/use-task";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

export const TaskDescription = ({
    description,
    taskId
}: {
    description: string;
    taskId: string;
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    const {mutate, isPending} = useUpdateTaskDescriptionMutation()

    const updateDescription = () => {
        mutate({taskId, description: newDescription},
            {
                onSuccess: () => {
                    setIsEditing(false)
                    toast.success("Description Updated Successfully")
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
        <div className="flex items-center gap-2">
            {isEditing ? (
                <Textarea
                    className="w-full min-w-3xl"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                 />
            ) : (
                <div className="text-sm md:text-base text-pretty flex-1 text-muted-foreground">
                    {description}
                </div>
            )}
            {isEditing ? (
                <Button className="py-0" size={"sm"} onClick={updateDescription} disabled={isPending} >Save</Button>
            ) : (
                <Edit className="size-3 cursor-pointer" onClick={() => setIsEditing(true)}/>
            )}
        </div>
    )
}