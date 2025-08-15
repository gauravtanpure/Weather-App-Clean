import React, { useState } from "react";
import { ThemeContext } from "./ThemeProvider";

interface RegisterProps {
  onRegister: (email: string) => void;
  onLoginClick: () => void;
}

const API_BASE = "http://localhost:8000";

export default function Register({ onRegister, onLoginClick }: RegisterProps): JSX.Element {
  const themeContext = React.useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Registration failed");
      }
      // Optionally auto-login after register:
      onRegister(email);
    } catch (err: any) {
      setError(err?.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-slate-800 dark:bg-slate-200">
        <h2 className="text-3xl font-bold text-center text-slate-200 dark:text-slate-800 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-400 dark:text-slate-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-400 dark:text-slate-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-400 dark:text-slate-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
              placeholder="Enter a password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 font-bold text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-slate-400 dark:text-slate-600">
          Already have an account?{" "}
          <button onClick={onLoginClick} className="text-sky-400 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
