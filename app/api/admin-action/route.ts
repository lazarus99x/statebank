import { NextResponse } from "next/server";
import { adminClient } from "@/lib/admin-supabase";

export async function POST(request: Request) {
  try {
    const { action, userId, data } = await request.json();

    switch (action) {
      case "ban":
        await adminClient.from("bank_accounts").update({ status: "frozen" }).eq("user_id", userId);
        return NextResponse.json({ success: true, message: "Account frozen" });

      case "unban":
        await adminClient.from("bank_accounts").update({ status: "active" }).eq("user_id", userId);
        return NextResponse.json({ success: true, message: "Account unfrozen" });

      case "delete":
        // Soft-delete: mark accounts as closed
        await adminClient.from("bank_accounts").update({ status: "closed" }).eq("user_id", userId);
        return NextResponse.json({ success: true, message: "Accounts closed" });

      case "verify_kyc":
        await adminClient.from("profiles").update({ kyc_status: "verified" }).eq("user_id", userId);
        return NextResponse.json({ success: true, message: "KYC verified" });

      case "assign_number": {
        // Generate a new account number for the user's first account
        const { default: genNum } = await import("@/lib/account-number");
        const num = await genNum.generateAccountNumber();
        const { data: acct } = await adminClient
          .from("bank_accounts")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "active")
          .limit(1)
          .single();
        if (acct) {
          await adminClient.from("bank_accounts").update({ account_number: num }).eq("id", acct.id);
          return NextResponse.json({ success: true, message: `Assigned ${num}` });
        }
        return NextResponse.json({ success: false, error: "No active account found" });
      }

      case "limits": {
        const { dailyLimit, monthlyLimit } = data || {};
        await adminClient.from("bank_accounts")
          .update({
            daily_withdrawal_limit: dailyLimit || 10000,
            monthly_withdrawal_limit: monthlyLimit || 50000,
          })
          .eq("user_id", userId);
        return NextResponse.json({ success: true, message: "Limits updated" });
      }

      default:
        return NextResponse.json({ success: false, error: "Unknown action" });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Action failed" });
  }
}