import { useState } from "react";
import { deleteContext, updateContext } from "../api/contexts";

function ContextList({ contexts, projectId, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [value, setValue] = useState("");

  return (
    <div>
      <h3>Contexts</h3>

      <ul>
        {contexts.map((context) => (
          <li key={context.id}>
            {editingId === context.id ? (
              <>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={async (e) => {
                    
                    if (e.key === "Enter") {
                      await updateContext(context.id, value, projectId);
                      setEditingId(null);
                      onChange();
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
                    onChange();
                  }}
                >
                  💾
                </button>
              </>
            ) : (
              <>
                {context.content}
                <button
                  onClick={() => {
                    setEditingId(context.id);
                    setValue(context.content);
                  }}
                >
                 <button style={{ marginLeft: 8 }}>✏️</button>
                </button>
                <button
                  onClick={async () => {
                    await deleteContext(context.id);
                    onChange();
                  }}
                >
                 <button style={{ marginLeft: 4 }}>❌</button>
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextList;



/** import { deleteContext } from "../api/contexts";

function ContextList({ contexts, onContextDeleted }) {
  return (
    <div>
      <h3>Contexts</h3>

      {contexts.length === 0 && <p>No contexts found.</p>}

      <ul>
        {contexts.map((context) => (
          <li key={context.id}>
            {context.content}

            <button
              style={{ marginLeft: "10px" }}
              onClick={async () => {
                await deleteContext(context.id);
                onContextDeleted();
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextList;
*/ 