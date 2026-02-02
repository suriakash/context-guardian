import { useState } from "react";
import { createProject } from "../api/projects";

export default function ProjectForm({ users, onProjectCreated }) {
  const [name, setName] = useState("");
  const [ownerUserId, setOwnerUserId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createProject({
        name,
        owner_user_id: Number(ownerUserId),
      });
      setName("");
      setOwnerUserId("");
      onProjectCreated();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={ownerUserId}
          onChange={(e) => setOwnerUserId(e.target.value)}
          required
        >
          <option value="">Select Owner</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name} ({u.email})
            </option>
          ))}
        </select>

        <button>Create</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
