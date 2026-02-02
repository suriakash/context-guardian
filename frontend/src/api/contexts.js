const API_BASE = "http://127.0.0.1:8000";

// 🔹 Fetch contexts for a project
export async function getContexts(projectId) {
  const res = await fetch(
    `${API_BASE}/projects/${projectId}/contexts`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch contexts: ${res.status}`);
  }

  return res.json();
}

// 🔹 Create a context
export async function createContext(payload) {
  const res = await fetch(`${API_BASE}/contexts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

// Delete Contexts
export async function deleteContext(contextId) {
  const res = await fetch(
    `http://127.0.0.1:8000/contexts/${contextId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    throw new Error("Failed to delete context");
  }

  return res.json();
}

export async function updateContext(contextId, content, projectId) {
  const res = await fetch(
    `http://127.0.0.1:8000/contexts/${contextId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        project_id: projectId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update context");
  }

  return res.json();
}
