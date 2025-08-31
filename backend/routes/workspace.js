import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validate-schema.js";
import { createWorkspace, getWorkspaceDetails, getWorkspaceProjects, getWorkspaces } from "../controllers/workspace.controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = Router()

router.post("/", authMiddleware,
    validateRequest({
        body: workspaceSchema
    }),
    createWorkspace
)

router.get("/", authMiddleware, getWorkspaces)
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails)
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects)

export default router