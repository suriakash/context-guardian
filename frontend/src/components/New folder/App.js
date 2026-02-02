
import { useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UsersList from "./components/UsersList";
import ProjectForm from "./components/ProjectForm";
import ProjectsList from "./components/ProjectsList";
import ContextForm from "./components/ContextForm";
import ContextList from "./components/ContextList";

import { getContexts } from "./api/contexts";
import { getUsers } from "./api/users";
import { getProjects } from "./api/projects";


export default function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [contexts, setContexts] = useState([]);
  const [contextsLoading, setContextsLoading] = useState(false);

  // USERS
  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  // PROJECTS
  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  // CONTEXTS (per project)
  const loadContexts = async (projectId) => {
  if (!projectId) {
    setContexts([]);
    return;
  }

  setContextsLoading(true);

  try {
    const data = await getContexts(projectId);
    setContexts(data);
  } finally {
    setContextsLoading(false);
  }
};


  // Initial load
  useEffect(() => {
    loadUsers();
    loadProjects();
  }, []);

  // Reload contexts when project changes
  useEffect(() => {
    loadContexts(selectedProjectId);
  }, [selectedProjectId]);

  return (
    <div>
      <h1>Context Guardian</h1>

      {/* USERS */}
      <UserForm onUserCreated={loadUsers} />
      <UsersList users={users} />

      <hr />

      {/* PROJECTS */}
      <ProjectForm users={users} onProjectCreated={loadProjects} />
      <ProjectsList
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />

      <hr />

      {/* CONTEXTS */}
      {selectedProjectId !== null && (
        <>
          <ContextForm
            projectId={selectedProjectId}
            onContextCreated={() => loadContexts(selectedProjectId)}
          />
          <ContextList
            contexts={contexts}
            projectId={selectedProjectId}
            loading={contextsLoading}
            onChange={() => loadContexts(selectedProjectId)}
          />

        </>
      )}
    </div>
  );
}
