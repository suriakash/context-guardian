import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext } from "../api/contexts";

function ContextForm({ projectId }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createContext,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (newContext) => {
      setError(null);

      await queryClient.cancelQueries([
        "contexts",
        projectId,
      ]);

      const previousContexts =
        queryClient.getQueryData([
          "contexts",
          projectId,
        ]) || [];

      const optimisticContext = {
        id: Date.now() * -1,
        content: newContext.content,
        project_id: projectId,
        optimistic: true,
      };

      queryClient.setQueryData(
        ["contexts", projectId],
        [optimisticContext, ...previousContexts]
      );

      return { previousContexts };
    },

    // ❌ ROLLBACK
    onError: (_err, _newContext, context) => {
      queryClient.setQueryData(
        ["contexts", projectId],
        context.previousContexts
      );
      setError("Failed to create context");
    },

    // ✅ CONFIRM
    onSuccess: () => {
      queryClient.invalidateQueries([
        "contexts",
        projectId,
      ]);
      setContent("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) return;

    mutation.mutate({
      content,
      project_id: projectId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Context</h3>

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Context content"
        required
        disabled={mutation.isLoading}
      />

      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Creating..." : "Create"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ContextForm;
