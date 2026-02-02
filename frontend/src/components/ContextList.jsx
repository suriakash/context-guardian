import { useState } from "react";
import { deleteContext, updateContext } from "../api/contexts";
import { useQueryClient } from "@tanstack/react-query";

function ContextList({ contexts, projectId, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  return (
    <div>
      <h3>Contexts</h3>

      {loading && <p>Loading contexts...</p>}

      {!loading && contexts.length === 0 && (
        <p>No contexts found.</p>
      )}

      {!loading && (
        <ul>
          {contexts.map((context) => (
            <li
              key={context.id}
              style={{ opacity: context.optimistic ? 0.6 : 1 }}
            >
              {editingId === context.id ? (
                <>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        await updateContext(
                          context.id,
                          value,
                          projectId
                        );
                        setEditingId(null);
                        queryClient.invalidateQueries([
                          "contexts",
                          projectId,
                        ]);
                      }
                      if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                  />
                  <button
                    onClick={async () => {
                      await updateContext(
                        context.id,
                        value,
                        projectId
                      );
                      setEditingId(null);
                      queryClient.invalidateQueries([
                        "contexts",
                        projectId,
                      ]);
                    }}
                  >
                    💾
                  </button>
                </>
              ) : (
                <>
                  {context.content}
                  {context.optimistic && " (saving...)"}

                  {!context.optimistic && (
                    <>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          setEditingId(context.id);
                          setValue(context.content);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        style={{ marginLeft: 4 }}
                        onClick={async () => {
                          await deleteContext(context.id);
                          queryClient.invalidateQueries([
                            "contexts",
                            projectId,
                          ]);
                        }}
                      >
                        ❌
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContextList;
