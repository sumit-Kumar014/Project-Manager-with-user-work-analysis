// import { StatsCard } from "@/components/dashboard/stats-card";
// import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Bell, Search } from "lucide-react";

// export default function DashboardHome({ stats, taskTrendsData, projectStatusData, taskPriorityData, workspaceProductivityData, upcomingTasks, recentProjects }) {
//   return (
//     <div className="flex flex-col gap-8 p-6">
//       {/* Top Navbar */}
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-8 pr-3 py-2 rounded-lg border border-input bg-background text-sm"
//             />
//           </div>
//           <Bell className="h-5 w-5 text-muted-foreground cursor-pointer" />
//           <Avatar className="cursor-pointer">
//             <AvatarImage src="/placeholder.png" alt="User" />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//         </div>
//       </header>

//       {/* Stats Overview */}
//       <StatsCard data={stats} />

//       {/* Charts */}
//       <StatisticsCharts
//         stats={stats}
//         taskTrendsData={taskTrendsData}
//         projectStatusData={projectStatusData}
//         taskPriorityData={taskPriorityData}
//         workspaceProductivityData={workspaceProductivityData}
//       />

//       {/* Bottom Section */}
//       <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
//         {/* Upcoming Tasks */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base font-medium">Upcoming Tasks</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3">
//               {upcomingTasks.length > 0 ? (
//                 upcomingTasks.map((task) => (
//                   <li key={task._id} className="flex items-center justify-between border-b pb-2">
//                     <span className="text-sm font-medium">{task.title}</span>
//                     <span className="text-xs text-muted-foreground">
//                       {new Date(task.dueDate).toLocaleDateString()}
//                     </span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground">No upcoming tasks</p>
//               )}
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Recent Projects */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base font-medium">Recent Projects</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3">
//               {recentProjects.length > 0 ? (
//                 recentProjects.map((project) => (
//                   <li key={project._id} className="flex items-center justify-between border-b pb-2">
//                     <span className="text-sm font-medium">{project.title}</span>
//                     <span className="text-xs text-muted-foreground">
//                       {new Date(project.createdAt).toLocaleDateString()}
//                     </span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground">No recent projects</p>
//               )}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
