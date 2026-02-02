
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users";

function UserForm() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setEmail("");
      setFullName("");
    },
    onError: () => {
      setError("Email already exists");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    mutation.mutate({
      email,
      full_name: fullName,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create User</h3>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        required
      />

      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Creating..." : "Create"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default UserForm;
