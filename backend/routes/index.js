import { Router } from "express"
import authRoutes from "./auth.js"
import workspaceRoutes from "./workspace.js"
import projectRoutes from "./project.js"
import taskRoutes from "./tasks.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/workspaces", workspaceRoutes)
router.use("/projects", projectRoutes)
router.use("/tasks", taskRoutes)

export default router