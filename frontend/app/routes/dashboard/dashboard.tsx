import { StatisticsCharts } from "@/components/dashboard/statistics-charts"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentProjects } from "@/components/projects/recent-projects"
import { UpcomingTasks } from "@/components/task/upcoming-task"
import Loader from "@/components/ui/loader"
import { useGetWorkspaceStatsQuery } from "hooks/use-workspace"
import { useNavigate, useSearchParams } from "react-router"
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "types"

const Dashboard = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  let workspaceId = searchParams.get("workspaceId")
  if(!workspaceId) workspaceId = ""
  const { data, isLoading } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data?: {
      stats: StatsCardProps
      taskTrendsData: TaskTrendsData[]
      projectStatusData: ProjectStatusData[]
      taskPriorityData: TaskPriorityData[]
      workspaceProductivityData: WorkspaceProductivityData[]
      upcomingTasks: Task[]
      recentProjects: Project[]
    }
    isLoading: boolean
  }


  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center space-y-6 bg-gradient-to-b from-background via-muted/30 to-background rounded-lg">
        {/* Animated logo container */}
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 shadow-lg animate-bounce">
          <span className="text-5xl">📂</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Welcome to TaskTribe
        </h1>

        <p className="text-muted-foreground max-w-md">
          Select or create a workspace to start tracking projects, tasks, and productivity.
        </p>

        <button
          onClick={() => navigate("/workspaces")}
          className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90 transition-all shadow-md"
        >
          + Create Workspace
        </button>
      </div>
    )
  }



  if (isLoading || !data)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    )

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your workspace activity and performance
          </p>
        </div>
        <div className="flex items-center space-x-3">

        </div>
      </div>

      {/* Stats Cards */}
      <StatsCard data={data.stats} />

      {/* Charts Section */}
      <div className="rounded-xl bg-card p-6 shadow-md border">
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      </div>

      {/* Projects + Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 shadow-md border">
          <RecentProjects data={data.recentProjects} />
        </div>
        <div className="rounded-xl bg-card p-6 shadow-md border">
          <UpcomingTasks data={data.upcomingTasks} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
