import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg("Login successful! Redirecting… ✨");

      // redirect to dashboard or home page
      setTimeout(() => navigate("/"), 1000);

    } catch (e) {
      setMsg("Invalid email or password ❌");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50">
      <form
        onSubmit={submit}
        className="w-96 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border"
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          Welcome Back 💖
        </h1>

        <input
          required
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 mb-3 border rounded-md"
        />

        <input
          required
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-3 border rounded-md"
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded-md bg-pink-300 hover:bg-pink-400 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="mt-3 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

        {msg && (
          <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>
        )}
      </form>
    </div>
  );
}
