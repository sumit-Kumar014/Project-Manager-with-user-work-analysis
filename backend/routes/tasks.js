import { Router } from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { taskSchema } from "../libs/validate-schema.js";
import { addComment, addSubTask, 
archivedTask, createTask, 
getCommentsByTaskId, getResourceActivityById, 
getTaskById, updateSubTask, 
updateTaskAssignees, updateTaskDescription, 
updateTaskPriority, updateTaskStatus, 
updateTaskTitle, watchTask, getMyTasks } from "../controllers/task.controller.js";

const router = Router()

router.post(
    "/:projectId/create-task",
    authMiddleware,
    validateRequest({
        params: z.object({
            projectId: z.string()
        }),
        body: taskSchema
    }),
    createTask
)

router.post(
    "/:taskId/add-subtask",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({title: z.string()})
    }),
    addSubTask
)

router.post(
    "/:taskId/add-comment",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({text: z.string()})
    }),
    addComment
)

router.post(
    "/:taskId/watch",
    authMiddleware,
    validateRequest({
        params: z.object({ taskId: z.string()})
    }),
    watchTask
)

router.post(
    "/:taskId/archived",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()})
    }),
    archivedTask
)

router.put(
    "/:taskId/update-subtask/:subTaskId",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string(), subTaskId: z.string()}),
        body: z.object({completed: z.boolean()})
    }),
    updateSubTask
)

router.put(
    "/:taskId/update-title",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({title: z.string()})
    }),
    updateTaskTitle
)

router.put(
    "/:taskId/update-description",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({description: z.string()})
    }),
    updateTaskDescription
)

router.put(
    "/:taskId/update-status",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({status: z.string()})
    }),
    updateTaskStatus
)

router.put(
    "/:taskId/update-assignees",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({assignees: z.array(z.string())})
    }),
    updateTaskAssignees
)

router.put(
    "/:taskId/update-priority",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()}),
        body: z.object({priority: z.string()})
    }),
    updateTaskPriority
)

router.get(
    "/:resourceId/activity", 
    authMiddleware,
    validateRequest({
        params: z.object({resourceId: z.string()}),
    }),
    getResourceActivityById
)

router.get(
    "/:taskId/comments",
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()})
    }),
    getCommentsByTaskId
)
router.get("/my-tasks", authMiddleware, getMyTasks);

router.get(
    "/:taskId", 
    authMiddleware,
    validateRequest({
        params: z.object({taskId: z.string()})
    }),
    getTaskById
)

export default router