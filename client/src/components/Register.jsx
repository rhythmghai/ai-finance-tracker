import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/auth/register", { email, password });

      setMsg("Account created! Redirecting to login… 💖");

      // small delay to show message
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-pink-50 via-blue-50 to-green-50">
      <form
        onSubmit={handleRegister}
        className="w-96 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border"
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          Create Your Account 💖
        </h1>

        <input
          required
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded-md bg-pink-300 hover:bg-pink-400 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Register"}
        </button>

        <p className="mt-3 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">Login</Link>
        </p>

        {msg && (
          <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>
        )}
      </form>
    </div>
  );
}
