function ProjectsList({ projects, selectedProjectId, onSelectProject }) {
  return (
    <div>
      <h3>Projects</h3>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <button
              onClick={() => onSelectProject(project.id)}
              style={{
                fontWeight:
                  project.id === selectedProjectId ? "bold" : "normal",
              }}
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsList;
