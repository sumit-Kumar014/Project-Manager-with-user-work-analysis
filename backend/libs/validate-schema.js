import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "password must be atleast 8 chracters long")
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "password must be atleast 8 chracters long")
})

const verificationSchema = z.object({
    token: z.string().min(1, "Token is required")
})

const resetPasswordRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const tokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member", "viewer"]),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be atleast 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required")
})

const workspaceSchema = z.object({
    name: z.string().min(3, "Name is required"),
    description: z.string().optional(),
    color: z.string().min(3, "Color is required")
})

const projectSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["Planning", "In Progress", "On Hold", "Completed", "Cancelled"]),
    startDate: z.string(),
    dueDate: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    tasks: z.array(z.string()).optional(),
    members: z.array(z.object({
        user: z.string().min(1, "User ID is required"),
        role: z.enum(["manager", "contributor", "viewer"]).optional()
    })).optional(),
    tags: z.string().optional(),
    createdBy: z.string().min(1, "Creator ID is required").optional(),
    isArchived: z.boolean().optional()
})

const taskSchema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due Date is required"),
    assignees: z.array(z.string()).min(1, "Atleast one assignee is required"),
})

export {
    tokenSchema,
    emailSchema,
    inviteMemberSchema,
    taskSchema,
    projectSchema,
    workspaceSchema,
    resetPasswordSchema,
    resetPasswordRequestSchema,
    registerSchema,
    loginSchema, 
    verificationSchema
}