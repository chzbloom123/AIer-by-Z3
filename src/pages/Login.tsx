import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    const { token } = await res.json();
    localStorage.setItem("token", token);
    navigate("/admin");
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="font-headline text-2xl font-bold text-editorial-950 mb-6">
        Admin Login
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-editorial-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-editorial-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-editorial-900 text-white py-2 rounded text-sm hover:bg-editorial-700 transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
