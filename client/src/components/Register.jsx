import { useState } from "react";
import API from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/register", { email, password });
      setMsg("Account created! You can now login.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-pink-50 via-blue-50 to-green-50">
      <form
        onSubmit={handleRegister}
        className="w-96 p-6 pastel-card rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Create Account 💖</h1>

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

        <button className="w-full py-2 rounded-md bg-pink-300 hover:bg-pink-400">
          Register
        </button>

        <p className="mt-3 text-center text-gray-500 text-sm">
          {msg}
        </p>
      </form>
    </div>
  );
}
