"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          DocSync
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">{user.fullName}</span>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/registration")}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
