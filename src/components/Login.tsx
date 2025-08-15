import React, { useState } from "react";
import { ThemeContext } from "./ThemeProvider";

interface LoginProps {
  onLogin: (user: { name: string; token: string }) => void;
  onRegisterClick: () => void;
}

const API_BASE = "https://weather-react-project-b0at.onrender.com";

export default function Login({ onLogin, onRegisterClick }: LoginProps): JSX.Element {
  const themeContext = React.useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Login failed");
      }

      const data = await res.json();
      // Expected response: { access_token: "...", name: "John Doe" }
      onLogin({ name: data.name, token: data.access_token });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-slate-800 dark:bg-slate-200">
        <h2 className="text-3xl font-bold text-center text-slate-200 dark:text-slate-800 mb-6">Login</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-400 dark:text-slate-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-900 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-400 dark:text-slate-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-900 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white rounded-lg bg-sky-500 hover:bg-sky-600"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-400 dark:text-slate-600">
          Don't have an account?{" "}
          <button onClick={onRegisterClick} className="text-sky-400 hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
