import AppLayout from "../../components/layout/AppLayout";
import MeetingsList from "../../components/projects/MeetingsList";

export default function ProjectPage() {
  return (
    <AppLayout>
      <h1 className="text-xl font-semibold mb-4">
        Product Roadmap
      </h1>
      <MeetingsList />
    </AppLayout>
  );
}