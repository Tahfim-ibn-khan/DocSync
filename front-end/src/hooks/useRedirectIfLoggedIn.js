"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("/dashboard");
    }
  }, []);
}
