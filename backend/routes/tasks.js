import { Router } from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import z from "zod";
import { taskSchema } from "../libs/validate-schema.js";
import { createTask } from "../controllers/task.controller.js";

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

export default router