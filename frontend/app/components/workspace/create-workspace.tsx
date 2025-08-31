import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useCreateWorkspace } from "hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { z }from "zod";

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean;
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export type WorkspaceForm = z.infer<typeof workspaceSchema>

export const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Amber/Orange
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#6366F1", // Indigo
    "#F97316", // Orange
    "#84CC16", // Lime
    "#06B6D4", // Cyan
    "#BE123C", // Rose
    "#0EA5E9", // Sky
    "#D946EF"  // Fuchsia
];

export const CreateWorkspace = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colors[0],
            description: ""
        }
    })

    const navigate = useNavigate()
    const { mutate: createWorkspace, isPending } = useCreateWorkspace()

    const onSubmit = (data: WorkspaceForm) => {
        createWorkspace(data, {
            onSuccess: (data: any) => {
                setIsCreatingWorkspace(false)
                form.reset()
                toast.success("Workspace created successfully")
                navigate(`/worspaces/${data._id}`)
            },
            onError: (error: any) => {
                const errorMessage = error.message
                toast.error(errorMessage)
                console.log(errorMessage)
            }
        })
    }

    return (
        <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true} >
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                    </DialogHeader>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} placeholder="Workspace Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Workspace Description" rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-3 flex-wrap max-h-32 overflow-y-auto p-2 rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                                {colors.map((color) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => field.onChange(color)}
                                                        className={`w-8 h-8 rounded-full cursor-pointer transition border-2 ${field.value === color ? "ring-2 ring-offset-1 ring-blue-500" : "border-transparent"} hover:scale-110 hover:shadow-md`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}