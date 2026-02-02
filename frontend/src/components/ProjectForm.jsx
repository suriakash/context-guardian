import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/projects";

export default function ProjectForm({ users }) {
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setName("");
      setOwnerId("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    if (!ownerId) {
      alert("Please select a project owner");
      return;
    }

    mutation.mutate({
      name,
      owner_id: Number(ownerId),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
      />

      <select
        value={ownerId}
        onChange={(e) => setOwnerId(e.target.value)}
      >
        <option value="">Select Owner</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.full_name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={mutation.isLoading}>
        Create
      </button>

      {mutation.isError && (
        <p style={{ color: "red" }}>Failed to create project</p>
      )}
    </form>
  );
}
