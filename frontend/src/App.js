import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import ProjectPage from "./pages/projects/ProjectPage";
import MeetingPage from "./pages/meetings/MeetingPage";

function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:id" element={<ProjectPage />} />
      <Route path="/meetings/:id" element={<MeetingPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
