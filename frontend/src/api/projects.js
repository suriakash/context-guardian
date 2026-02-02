
const API_BASE = "http://127.0.0.1:8000";

export async function getUsers() {
  const res = await fetch("http://127.0.0.1:8000/users");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch users (${res.status})`);
  }

  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch projects (${res.status})`);
  }

  return res.json();
}

export async function uploadProjectContext(projectId, files) {
  const formData = new FormData();
  formData.append("main_py", files.main);
  formData.append("projects_js", files.projects);
  formData.append("projectform_jsx", files.projectForm);

  const res = await fetch(
    `/projects/${projectId}/context`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Context upload failed");
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
    const text = await res.text();
    throw new Error(text || "Failed to create project");
  }

  return res.json();
}
