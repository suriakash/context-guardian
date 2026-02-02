const API_BASE = "http://127.0.0.1:8000";

export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects`);

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create project");
  }

  return res.json();
}
