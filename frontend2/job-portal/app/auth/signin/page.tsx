"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
           <input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  placeholder="you@example.com"
  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
          <input
  id="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  placeholder="••••••••"
  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
