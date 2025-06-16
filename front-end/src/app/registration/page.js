"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn";


export default function RegisterPage() {
  useRedirectIfLoggedIn();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-800"
          required
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-800"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Avatar URL (optional)"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-800"
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-gray-800"
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
