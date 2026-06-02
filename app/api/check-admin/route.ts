import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-supabase";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false });
    }

    // Get the user's profile id first
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ isAdmin: false });
    }

    // Check admin_profiles using service role key (bypasses RLS)
    const { data: adminProfile } = await adminClient
      .from("admin_profiles")
      .select("role")
      .eq("user_id", profile.id)
      .single();

    const isAdmin = adminProfile?.role?.toLowerCase() === "admin";

    return NextResponse.json({ isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}