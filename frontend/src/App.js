
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react"
import UserForm from "./components/UserForm";
import UsersList from "./components/UsersList";
import ProjectForm from "./components/ProjectForm";
import ProjectsList from "./components/ProjectsList";
import ContextForm from "./components/ContextForm";
import ContextList from "./components/ContextList";

import { getUsers } from "./api/users";
import { getProjects } from "./api/projects";
import { getContexts } from "./api/contexts";

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

/**  Add START   */
  useEffect(() => {
  if (
    selectedProjectId &&
    !projects.some(p => p.id === selectedProjectId)
    ) {
      setSelectedProjectId(null);
      }
  }, [projects, selectedProjectId]);

  /**  Add END  */ 
  const { data: contexts = [], isLoading: contextsLoading } = useQuery({
    queryKey: ["contexts", selectedProjectId],
    queryFn: () => getContexts(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  return (
    <div>
      <h1>Context Guardian</h1>

      <UserForm />
      {usersLoading ? <p>Loading users...</p> : <UsersList users={users} />}

      <hr />

      <ProjectForm users={users} />
      {projectsLoading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectsList
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      )}

      <hr />

      {selectedProjectId && (
        <>
          <ContextForm projectId={selectedProjectId} />
          <ContextList
            contexts={contexts}
            loading={contextsLoading}
            projectId={selectedProjectId}
          />
        </>
      )}
    </div>
  );
}

export default App;
