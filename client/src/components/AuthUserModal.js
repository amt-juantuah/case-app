"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

// simple auth login modal
export default function AuthUserModal() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { err, loginUser, showLoginModal, setShowLoginModal } = useAuth();

  if (!showLoginModal) return null;

  // submit form data
  const handleSubmit = () => {
    loginUser({username, password});
    setUsername("");
    setPassword("");
  }

  if (!showLoginModal) return null;
  return (
    <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50">
      <div className="bg-white mb-4 rounded-lg w-full max-w-sm p-2 shadow-xl animate-fadeIn">
        <h2 className="text-lg font-bold text-center text-pink-900">Secure System: Access Required</h2>
      </div>
      <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Sign In</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full border-2 rounded-lg p-2 text-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-2 rounded-lg p-2 text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
        {err && <h4 className="text-sm font-bold py-2 text-red-500 text-center">{err}</h4>}
      </div>
    </div>
  );
};

