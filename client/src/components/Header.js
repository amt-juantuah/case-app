"use client";

import { useAuth } from "./AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1 className="text-xl font-bold">Case Management System</h1>

        {user && (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-400">
              {user.username} |
            </span>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        ) }
      </div>
    </header>
  );
}
