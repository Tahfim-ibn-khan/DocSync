"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/login");
    }
  }, []);
}
