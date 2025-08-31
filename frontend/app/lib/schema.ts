import { z } from "zod"
import { ProjectStatus } from "types"

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password is required")
})

export const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at atleast 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be atleast 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match"
})

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be 8 charcters long")
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match"
})

export const forgetPasswordSchema = z.object({
    email: z.string().email("Inalid email address")
})

export const workspaceSchema = z.object({
    name: z.string().min(3, "Name must have atleast 3 characters"),
    color: z.string().min(3, "Color must have atleast 3 characters"),
    description: z.string().optional()

})

export const projectSchema = z.object({
    title: z.string().min(3, "Title must have atleast 3 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(3, "Start date is required"),
    dueDate: z.string().min(3, "Due date is required"),
    members: z.array(z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"])
    })).optional(),
    tags: z.string().optional()
})