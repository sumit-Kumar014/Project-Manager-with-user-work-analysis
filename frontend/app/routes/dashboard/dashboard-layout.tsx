import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Loader from "@/components/ui/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { getData } from "@/lib/fetch-utils";
import { useAuth } from "provider/auth-context";
import { useState } from "react";
import { Navigate, Outlet, useLoaderData } from "react-router";
import type { Workspace } from "types";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([getData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
    return { workspaces: [] }; // ✅ fallback so Header never breaks
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkSpace] = useState<Workspace | null>(
    null
  );

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  if (isLoading) return <Loader />;

  const handleWorkspaceSelcted = (workspace: Workspace) => {
    setCurrentWorkSpace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        <Header
          workspaces={workspaces} // ✅ pass down as props
          onWorkspaceSelected={handleWorkspaceSelcted}
          selectedWorkspace={currentWorkspace}
          onCreatedWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
