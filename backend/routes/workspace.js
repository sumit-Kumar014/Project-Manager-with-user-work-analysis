import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { inviteMemberSchema, tokenSchema, workspaceSchema } from "../libs/validate-schema.js";
import { acceptGenerateInvite, acceptInviteByToken, createWorkspace, getWorkspaceDetails, getWorkspaceInviteDetails, getWorkspaceProjects, getWorkspaces, getWorkspaceStats, inviteUserToWorkspace } from "../controllers/workspace.controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { z } from "zod"

const router = Router()

router.post("/", authMiddleware,
    validateRequest({
        body: workspaceSchema
    }),
    createWorkspace
)

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
)

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
)

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
)

router.get("/", authMiddleware, getWorkspaces)
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails)
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects)
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats)
router.get("/:workspaceId/invite", getWorkspaceInviteDetails);


export default router


