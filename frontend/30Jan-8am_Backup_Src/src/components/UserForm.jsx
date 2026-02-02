import { useState } from "react";
import { createUser } from "../api/users";

function UserForm({ onUserCreated }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createUser({
        email,
        full_name: fullName,
      });

      setEmail("");
      setFullName("");
      setMessage("User created successfully ✅");

      onUserCreated(); // 🔥 tell App to refresh users
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <button type="submit">Create</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default UserForm;
