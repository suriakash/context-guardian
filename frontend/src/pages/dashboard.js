import AppLayout from "../components/layout/AppLayout";
import KPICards from "../components/dashboard/KPICards";
import ProjectsTable from "../components/dashboard/ProjectsTable";
import ActivityFeed from "../components/dashboard/ActivityFeed";

export default function Dashboard() {
  return (
    <AppLayout>
      <KPICards />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <ProjectsTable />
        </div>
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
