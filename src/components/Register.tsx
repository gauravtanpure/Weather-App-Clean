import React, { useState } from "react";
import { ThemeContext } from "./ThemeProvider";
import { WiCloudy, WiDaySunny } from 'react-icons/wi';

interface RegisterProps {
  onRegister: (email: string) => void;
  onLoginClick: () => void;
}

const API_BASE = "https://weather-react-project-b0at.onrender.com";

const getDynamicIcon = () => {
  const hour = new Date().getHours();
  if (hour > 6 && hour < 18) {
    const isCloudy = Math.random() > 0.5;
    return isCloudy ? <WiCloudy size={64} className="text-gray-400 animate-pulse" /> : <WiDaySunny size={64} className="text-yellow-400 animate-spin" />;
  } else {
    return <WiCloudy size={64} className="text-gray-400 animate-pulse" />;
  }
};

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
      onRegister(email);
    } catch (err: any) {
      setError(err?.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          {getDynamicIcon()}
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white">
            Create an Account
          </h2>
        </div>
        {error && (
          <p className="p-3 mb-4 text-sm font-medium text-center text-red-700 bg-red-100 rounded-lg dark:text-red-400 dark:bg-red-900">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 transition duration-300 ease-in-out bg-gray-100 border border-transparent rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 transition duration-300 ease-in-out bg-gray-100 border border-transparent rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 transition duration-300 ease-in-out bg-gray-100 border border-transparent rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 font-bold text-white transition duration-300 ease-in-out bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <button onClick={onLoginClick} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}