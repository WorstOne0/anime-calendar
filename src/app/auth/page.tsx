"use client";

// Next
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// Controllers
import { useSessionController } from "@/core/controllers";

// AniList's redirect target. The token arrives in the fragment, which never reaches the server.
export default function AuthPage() {
  const setToken = useSessionController((state) => state.setToken);
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");
    if (token) setToken(token);

    router.replace("/");
  }, [router, setToken]);

  return <div className="h-full flex items-center justify-center label">anilist…</div>;
}
