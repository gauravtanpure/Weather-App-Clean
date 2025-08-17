import React, { useState } from "react";
import { ThemeContext } from "./ThemeProvider";
import { WiCloudy, WiDaySunny } from 'react-icons/wi';

interface LoginProps {
  onLogin: (user: { name: string; token: string }) => void;
  onRegisterClick: () => void;
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
      onLogin({ name: data.name, token: data.access_token });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          {getDynamicIcon()}
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white">
            Welcome Back
          </h2>
        </div>
        {error && (
          <p className="p-3 mb-4 text-sm font-medium text-center text-red-700 bg-red-100 rounded-lg dark:text-red-400 dark:bg-red-900">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
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
            className="w-full px-6 py-4 font-bold text-white transition duration-300 ease-in-out bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <button onClick={onRegisterClick} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}