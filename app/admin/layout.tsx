"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "redirecting">("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !user) {
        setStatus("redirecting");
        router.replace("/sign-in");
        return;
      }

      setStatus("ready");
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120]">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a73e8]/20 to-[#1a73e8]/5 ring-1 ring-[#1a73e8]/20">
            <Shield className="h-8 w-8 text-[#1a73e8]" />
          </div>
          <div className="mx-auto mb-4 h-2 w-32 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1a73e8] to-[#fbbf24]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "redirecting") return null;

  return (
    <div className="min-h-screen bg-[#0b1120] text-white/90">
      {children}
    </div>
  );
}