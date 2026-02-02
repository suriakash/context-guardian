import { useState } from "react";
import { createContext } from "../api/contexts";

function ContextForm({ projectId, onContextCreated }) {
  const [content, setContent] = useState("");

  console.log("ContextForm received projectId:", projectId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting context with projectId:", projectId);

    if (!projectId) {
      alert("❌ No project selected");
      return;
    }

    await createContext({
      content,
      project_id: projectId, // ✅ now defined
    });

    setContent("");
    onContextCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Context</h3>

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Context content"
        required
      />

      <button type="submit">Create</button>
    </form>
  );
}

export default ContextForm;
