import { Router } from 'express';
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from '../libs/validate-schema.js';
import { z } from 'zod';
import { createProject } from '../controllers/project.controller.js';
import authMiddleware from '../middleware/auth-middleware.js';

const router = Router();

router.post("/:workspaceId/create-project", authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: projectSchema
    }),
    createProject
)

export default router