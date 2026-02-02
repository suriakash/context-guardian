const API_BASE = "http://127.0.0.1:8000";

export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status}`);
  }

  return res.json();
}

/**     */
export async function checkEmailExists(email) {
  const res = await fetch(
    `http://127.0.0.1:8000/users`
  );

  if (!res.ok) {
    throw new Error("Failed to check users");
  }

  const users = await res.json();
  return users.some((u) => u.email === email);
}

export async function createUser(userData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create user");
  }

  return res.json();
}
