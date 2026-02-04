import { NavLink } from "react-router-dom";
import SearchBar from "../search/SearchBar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 text-xl font-bold">
          Context Guardian
        </div>

        <nav className="px-4 space-y-1 text-sm">
          <SidebarItem to="/dashboard" label="Dashboard" />
          <SidebarItem to="/projects/1" label="Projects" />
          <SidebarItem to="/usage" label="Usage" disabled />
          <SidebarItem to="/settings" label="Settings" disabled />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        
        <header className="h-14 bg-white border-b flex items-center px-6 gap-4">
          <span className="text-sm text-gray-600 font-medium">
            AI-Powered Meeting Intelligence
          </span>

          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarItem({ to, label, disabled }) {
  if (disabled) {
    return (
      <div className="px-3 py-2 rounded-md text-gray-400 cursor-not-allowed">
        {label}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md ${
          isActive
            ? "bg-blue-50 text-blue-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
