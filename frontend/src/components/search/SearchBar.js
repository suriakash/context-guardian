import { useState } from "react";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search meetings, decisions, action items…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(e.target.value.length > 0);
        }}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {open && (
        <SearchResults
          query={query}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
