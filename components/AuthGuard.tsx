"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, initialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [initialized, isLoggedIn, router, pathname]);

  if (!initialized || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
