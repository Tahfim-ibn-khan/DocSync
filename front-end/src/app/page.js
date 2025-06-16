// src/app/page.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
          Real-time Document Collaboration
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Create, edit, and share documents with your team in real-time. Stay connected and productive with DocSync.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/register")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/login")}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
              >
                Login
              </button>
            </>
          )}
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-3 text-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Live Collaboration</h3>
            <p className="mt-2 text-sm text-gray-600">
              Work with teammates on the same document simultaneously. See who’s online.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Secure & Private</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your documents are safe and accessible only to those you share them with.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Simple & Fast</h3>
            <p className="mt-2 text-sm text-gray-600">
              Intuitive interface with real-time saving. Start writing instantly.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-10">
        © {new Date().getFullYear()} DocSync. All rights reserved.
      </footer>
    </main>
  );
}
