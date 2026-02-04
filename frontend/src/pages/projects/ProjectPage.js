import AppLayout from "../../components/layout/AppLayout";
import MeetingsList from "../../components/projects/MeetingsList";
import Tooltip from "../../components/ui/Tooltip";

export default function ProjectPage() {
  return (
    <AppLayout>
      
      <h1 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
        Product Roadmap
        <Tooltip text="Strategic planning, prioritization, and delivery discussions" />
      </h1>


      <MeetingsList />
    </AppLayout>
  );
}