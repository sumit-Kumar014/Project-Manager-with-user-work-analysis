import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"),
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
        route("forget-password", "routes/auth/forget-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
        route("verify-email", "routes/auth/verify-email.tsx")
    ]),
    layout("routes/dashboard/dashboard-layout.tsx", [
        route("dashboard", "routes/dashboard/dashboard.tsx"),
        route("workspaces", "routes/dashboard/workspaces/index.tsx"),
        route("workspaces/:workspaceId/projects", "routes/dashboard/workspaces/workspace-details.tsx"),
        route("workspaces/:workspaceId/projects/:projectId", "routes/dashboard/project/project-details.tsx")
        
    ])
] satisfies RouteConfig;
