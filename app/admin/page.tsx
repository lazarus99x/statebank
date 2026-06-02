"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Building2, ArrowUpDown, Download, Upload, DollarSign, Shield, Headphones, Settings,
  Search, CheckCircle, XCircle, Clock, Ban, Trash2, Key, ChevronDown, ChevronUp,
  TrendingUp, BarChart3, FileText, Wallet, RefreshCw, MessageSquare, Plus, Lock, Eye, EyeOff, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"loading" | "login" | "denied" | "admin">("loading");
  const [activeTab, setActiveTab] = useState("overview");

  // Admin login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setAuthState("login");
      return;
    }

    // Call API route that uses service role key to bypass RLS
    const res = await fetch("/api/check-admin");
    const data = await res.json();

    if (data.isAdmin) {
      setAuthState("admin");
    } else {
      setAuthState("denied");
    }
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your admin credentials");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    // Re-check admin access after login
    await checkAdminAccess();
    setIsLoading(false);
  }

  // --- Show login form ---
  if (authState === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-600/5 ring-1 ring-blue-500/20">
              <Shield className="h-7 w-7 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
            <p className="mt-2 text-sm text-white/40">Authorized personnel only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@statebank.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-white/30">
            <Link href="/" className="underline underline-offset-2 hover:text-white/50">Back to Home</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // --- Access denied ---
  if (authState === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120] p-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
            <Shield className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="mt-2 text-sm text-white/40">You don&apos;t have admin privileges. Sign in with an admin account.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => { createClient().auth.signOut(); setAuthState("login"); }}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:bg-white/5">
              Sign Out
            </button>
            <Link href="/dashboard"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Loading ---
  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120]">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying access...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Full control over StateBank operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto -mx-3 px-3 pb-2">
          <TabsList className="inline-flex w-max gap-1 bg-card/50 backdrop-blur border border-border p-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "transactions", label: "Transactions", icon: ArrowUpDown },
              { id: "deposits", label: "Deposits", icon: Download },
              { id: "withdrawals", label: "Withdrawals", icon: Upload },
              { id: "loans", label: "Loans", icon: DollarSign },
              { id: "pov", label: "POV Codes", icon: Shield },
              { id: "support", label: "Support", icon: Headphones },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm gap-1.5 px-3 py-1.5"
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="users" className="space-y-4 mt-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4 mt-4">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="deposits" className="space-y-4 mt-4">
          <DepositsTab />
        </TabsContent>
        <TabsContent value="withdrawals" className="space-y-4 mt-4">
          <WithdrawalsTab />
        </TabsContent>
        <TabsContent value="loans" className="space-y-4 mt-4">
          <LoansTab />
        </TabsContent>
        <TabsContent value="pov" className="space-y-4 mt-4">
          <POVTab />
        </TabsContent>
        <TabsContent value="support" className="space-y-4 mt-4">
          <SupportTab />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-4">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---- Types for fetched data ----

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  kyc_status: string | null;
  created_at: string | null;
}

interface BankAccount {
  id: string;
  user_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
}

interface Transaction {
  id: string;
  transaction_ref: string;
  type: string;
  status: string;
  amount: number;
  from_account_id: string | null;
  to_account_id: string | null;
  description: string | null;
  pov_required: boolean;
  pov_verified: boolean;
  created_at: string | null;
  completed_at: string | null;
}

interface TransactionWithAccounts extends Transaction {
  from_account?: BankAccount | null;
  to_account?: BankAccount | null;
}

interface Loan {
  id: string;
  user_id: string;
  account_id: string;
  loan_type: string;
  principal: number;
  interest_rate: number;
  tenure_months: number;
  monthly_payment: number;
  remaining_balance: number;
  status: string;
  created_at: string | null;
}

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string | null;
  category: string | null;
  priority: string;
  status: string;
  created_at: string | null;
}

interface PovCode {
  id: string;
  transaction_id: string;
  attempts: number;
  max_attempts: number;
  created_at: string | null;
  used_at: string | null;
}

interface PoVItem {
  transaction_ref: string;
  user_name: string;
  amount: number;
  created_at: string;
  attempts: number;
  max_attempts: number;
}

// ---- Overview Tab ----

function OverviewTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    pendingTxns: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    activeLoans: 0,
    totalVolume: 0,
    pendingPov: 0,
  });
  const [recentTxns, setRecentTxns] = useState<TransactionWithAccounts[]>([]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const [
        { count: totalUsers },
        { count: totalAccounts },
        { count: pendingTxns },
        { count: pendingDepCount },
        { count: pendingWdCount },
        { count: activeLoanCount },
        { count: povPendingCount },
        { data: volData },
        { data: recentTxnData },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("bank_accounts").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "deposit").eq("status", "pending"),
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "withdrawal").eq("status", "pending"),
        supabase.from("loans").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("pov_required", true).eq("pov_verified", false).not("status", "eq", "completed"),
        supabase.from("transactions").select("amount").eq("status", "completed"),
        supabase.from("transactions")
          .select("id, transaction_ref, type, status, amount, from_account_id, to_account_id, description, pov_required, pov_verified, created_at, completed_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const totalVolume = volData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalAccounts: totalAccounts || 0,
        pendingTxns: pendingTxns || 0,
        pendingDeposits: pendingDepCount || 0,
        pendingWithdrawals: pendingWdCount || 0,
        activeLoans: activeLoanCount || 0,
        totalVolume,
        pendingPov: povPendingCount || 0,
      });
      setRecentTxns(recentTxnData || []);
    } catch (err) {
      console.error("Failed to fetch overview stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", change: `${stats.totalUsers} registered` },
    { label: "Total Accounts", value: stats.totalAccounts.toLocaleString(), icon: Building2, color: "text-green-500", change: `${stats.totalAccounts} open` },
    { label: "Pending Txns", value: stats.pendingTxns.toString(), icon: Clock, color: "text-yellow-500", change: `${stats.pendingTxns} need action` },
    { label: "Pending Deposits", value: stats.pendingDeposits.toString(), icon: Download, color: "text-cyan-500", change: `${stats.pendingDeposits} waiting` },
    { label: "Pending Withdrawals", value: stats.pendingWithdrawals.toString(), icon: Upload, color: "text-orange-500", change: `${stats.pendingWithdrawals} waiting` },
    { label: "Active Loans", value: stats.activeLoans.toString(), icon: DollarSign, color: "text-purple-500", change: `${stats.activeLoans} outstanding` },
    { label: "Total Volume", value: `$${stats.totalVolume.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500", change: "lifetime completed" },
    { label: "POV Pending", value: stats.pendingPov.toString(), icon: Shield, color: "text-red-500", change: `${stats.pendingPov} require codes` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <Card key={i} className="p-4 border-border bg-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-xs mt-1 text-muted-foreground">{s.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-muted ${s.color} shrink-0`}>
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 sm:p-6 border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {recentTxns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No transactions yet</div>
        ) : (
          <div className="space-y-3">
            {recentTxns.map((tx) => {
              const isCredit = tx.type === "deposit" || tx.type === "refund" || tx.type === "interest";
              return (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isCredit ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {isCredit ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.transaction_ref}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isCredit ? "text-green-500" : "text-red-500"}`}>
                      {isCredit ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ---- Users Tab ----

function UsersTab() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAccount, setDepositAccount] = useState("");
  const [users, setUsers] = useState<(Profile & { accounts_count: number; total_balance: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositUserId, setDepositUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profiles) {
        setUsers([]);
        return;
      }

      // For each profile, get their account count and total balance
      const enriched = await Promise.all(
        profiles.map(async (p: Profile) => {
          const { data: accounts } = await supabase
            .from("bank_accounts")
            .select("balance")
            .eq("user_id", p.id);

          const total_balance = accounts?.reduce((sum: number, a: { balance: number }) => sum + Number(a.balance), 0) || 0;
          return {
            ...p,
            accounts_count: accounts?.length || 0,
            total_balance,
          };
        })
      );

      setUsers(enriched);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(u =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="bg-background border-border" />
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <Card key={u.id} className="border-border bg-card overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{u.full_name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.kyc_status === "verified" ? "bg-green-500/10 text-green-500" : u.kyc_status === "rejected" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                    {u.kyc_status || "pending"}
                  </span>
                  {expanded === u.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {expanded === u.id && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground text-xs">Phone:</span><p className="text-foreground font-medium">{u.phone || "N/A"}</p></div>
                    <div><span className="text-muted-foreground text-xs">Accounts:</span><p className="text-foreground font-medium">{u.accounts_count}</p></div>
                    <div><span className="text-muted-foreground text-xs">Total Balance:</span><p className="text-foreground font-medium">${u.total_balance.toLocaleString()}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => { setShowDeposit(true); setDepositUserId(u.id); toast.info("Deposit form opened"); }}>
                      <Download className="w-3 h-3 mr-1" /> Deposit
                    </Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                      <Upload className="w-3 h-3 mr-1" /> Withdraw
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" /> Limits
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs">
                      <Ban className="w-3 h-3 mr-1" /> Freeze
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs">
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Key className="w-3 h-3 mr-1" /> Assign #
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verify KYC
                    </Button>
                  </div>

                  {showDeposit && depositUserId === u.id && (
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      <p className="text-sm font-medium">Deposit Funds</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Amount" type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="bg-background border-border text-sm" />
                        <Input placeholder="Account number" value={depositAccount} onChange={e => setDepositAccount(e.target.value)} className="bg-background border-border text-sm" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="backdate" className="accent-blue-500" />
                        <label htmlFor="backdate" className="text-xs text-muted-foreground">Back-date transaction</label>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full" onClick={() => { toast.success("Deposit processed"); setShowDeposit(false); }}>
                        Process Deposit
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Transactions Tab ----

function TransactionsTab() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [txs, setTxs] = useState<TransactionWithAccounts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTxns = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!txData) {
        setTxs([]);
        return;
      }

      // Fetch related bank accounts for from/to display
      const accountIds = new Set<string>();
      txData.forEach((t: Transaction) => {
        if (t.from_account_id) accountIds.add(t.from_account_id);
        if (t.to_account_id) accountIds.add(t.to_account_id);
      });

      let accountMap: Record<string, BankAccount> = {};
      if (accountIds.size > 0) {
        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("*")
          .in("id", Array.from(accountIds));

        if (accounts) {
          accounts.forEach((a: BankAccount) => {
            accountMap[a.id] = a;
          });
        }
      }

      const enriched: TransactionWithAccounts[] = txData.map((t: Transaction) => ({
        ...t,
        from_account: t.from_account_id ? accountMap[t.from_account_id] || null : null,
        to_account: t.to_account_id ? accountMap[t.to_account_id] || null : null,
      }));

      setTxs(enriched);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTxns();
  }, [fetchTxns]);

  const filtered = filter === "all" ? txs : txs.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <Card className="p-4 border-border bg-card">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "pending", "completed", "failed", "reversed", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No transactions found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(tx => {
            const fromDisplay = tx.from_account?.account_number || "External";
            const toDisplay = tx.to_account?.account_number || "External";
            return (
              <Card key={tx.id} className="border-border bg-card overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === tx.id ? null : tx.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-full shrink-0 ${tx.type === "deposit" ? "bg-green-500/10 text-green-500" : tx.type === "withdrawal" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                      {tx.type === "deposit" ? <Download className="w-4 h-4" /> : tx.type === "withdrawal" ? <Upload className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type} · ${Number(tx.amount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{tx.transaction_ref}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      tx.status === "completed" ? "bg-green-500/10 text-green-500" :
                      tx.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>{tx.status}</span>
                    {expanded === tx.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {expanded === tx.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground text-xs">From:</span><p className="text-foreground">{fromDisplay}</p></div>
                      <div><span className="text-muted-foreground text-xs">To:</span><p className="text-foreground">{toDisplay}</p></div>
                      <div><span className="text-muted-foreground text-xs">Date:</span><p className="text-foreground">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "N/A"}</p></div>
                      <div><span className="text-muted-foreground text-xs">POV Required:</span><p className={tx.pov_required ? "text-red-500" : "text-green-500"}>{tx.pov_required ? "Yes" : "No"}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                      <Button size="sm" variant="destructive" className="text-xs"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                      <Button size="sm" variant="outline" className="text-xs"><RefreshCw className="w-3 h-3 mr-1" /> Reverse</Button>
                      <Button size="sm" variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" /> Back-date</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- Deposits Tab ----

function DepositsTab() {
  const [deposits, setDeposits] = useState<TransactionWithAccounts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("type", "deposit")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!data) { setDeposits([]); return; }

      const accountIds = new Set<string>();
      data.forEach((t: Transaction) => {
        if (t.to_account_id) accountIds.add(t.to_account_id);
        if (t.from_account_id) accountIds.add(t.from_account_id);
      });

      let accountMap: Record<string, BankAccount> = {};
      if (accountIds.size > 0) {
        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("*")
          .in("id", Array.from(accountIds));
        if (accounts) {
          accounts.forEach((a: BankAccount) => { accountMap[a.id] = a; });
        }
      }

      const enriched: TransactionWithAccounts[] = data.map((t: Transaction) => ({
        ...t,
        from_account: t.from_account_id ? accountMap[t.from_account_id] || null : null,
        to_account: t.to_account_id ? accountMap[t.to_account_id] || null : null,
      }));

      setDeposits(enriched);
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (deposits.length === 0) {
    return <div className="text-center py-8 text-muted-foreground text-sm">No pending deposits</div>;
  }

  return (
    <div className="space-y-3">
      {deposits.map(d => (
        <Card key={d.id} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{d.description || "Deposit"}</p>
              <p className="text-xs text-muted-foreground">{d.transaction_ref} · {d.to_account?.account_number || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{d.created_at ? new Date(d.created_at).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-500">+${Number(d.amount).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => toast.success("Deposit approved")}>
              <CheckCircle className="w-3 h-3 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="destructive" className="flex-1 text-xs" onClick={() => toast.error("Deposit rejected")}>
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" /> Back-date
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---- Withdrawals Tab ----

function WithdrawalsTab() {
  const [withdrawals, setWithdrawals] = useState<TransactionWithAccounts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("type", "withdrawal")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!data) { setWithdrawals([]); return; }

      const accountIds = new Set<string>();
      data.forEach((t: Transaction) => {
        if (t.from_account_id) accountIds.add(t.from_account_id);
        if (t.to_account_id) accountIds.add(t.to_account_id);
      });

      let accountMap: Record<string, BankAccount> = {};
      if (accountIds.size > 0) {
        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("*")
          .in("id", Array.from(accountIds));
        if (accounts) {
          accounts.forEach((a: BankAccount) => { accountMap[a.id] = a; });
        }
      }

      const enriched: TransactionWithAccounts[] = data.map((t: Transaction) => ({
        ...t,
        from_account: t.from_account_id ? accountMap[t.from_account_id] || null : null,
        to_account: t.to_account_id ? accountMap[t.to_account_id] || null : null,
      }));

      setWithdrawals(enriched);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return <div className="text-center py-8 text-muted-foreground text-sm">No pending withdrawals</div>;
  }

  return (
    <div className="space-y-3">
      {withdrawals.map(w => (
        <Card key={w.id} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{w.description || "Withdrawal"}</p>
              <p className="text-xs text-muted-foreground">{w.transaction_ref} · {w.from_account?.account_number || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{w.created_at ? new Date(w.created_at).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-500">-${Number(w.amount).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
            <Button size="sm" variant="destructive" className="flex-1 text-xs"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---- Loans Tab ----

function LoansTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });

      setLoans(data || []);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loans.length === 0) {
    return <div className="text-center py-12 text-muted-foreground text-sm">No loans found</div>;
  }

  return (
    <div className="space-y-3">
      {loans.map(l => (
        <Card key={l.id} className="border-border bg-card">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === l.id ? null : l.id)}>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground capitalize">{l.loan_type} · ${Number(l.principal).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{l.id.slice(0, 8)} · {(Number(l.interest_rate) * 100).toFixed(2)}% APR</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                l.status === "active" ? "bg-green-500/10 text-green-500" :
                l.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                l.status === "defaulted" ? "bg-red-500/10 text-red-500" :
                "bg-muted text-muted-foreground"
              }`}>{l.status}</span>
              {expanded === l.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expanded === l.id && (
            <div className="px-4 pb-4 border-t pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Monthly:</span><p className="text-foreground">${Number(l.monthly_payment).toLocaleString()}/mo</p></div>
                <div><span className="text-muted-foreground text-xs">Remaining:</span><p className="text-foreground">${Number(l.remaining_balance).toLocaleString()}</p></div>
                <div><span className="text-muted-foreground text-xs">Tenure:</span><p className="text-foreground">{l.tenure_months} months</p></div>
                <div><span className="text-muted-foreground text-xs">Rate:</span><p className="text-foreground">{(Number(l.interest_rate) * 100).toFixed(2)}%</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                <Button size="sm" variant="destructive" className="text-xs"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                <Button size="sm" variant="outline" className="text-xs text-red-500"><Ban className="w-3 h-3 mr-1" /> Mark Defaulted</Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ---- POV Tab ----

function POVTab() {
  const [povItems, setPovItems] = useState<PoVItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPovItems = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      // Get transactions needing POV verification
      const { data: txData } = await supabase
        .from("transactions")
        .select("id, transaction_ref, type, amount, from_account_id, to_account_id, created_at")
        .eq("pov_required", true)
        .eq("pov_verified", false)
        .not("status", "eq", "completed")
        .order("created_at", { ascending: false });

      if (!txData || txData.length === 0) {
        setPovItems([]);
        return;
      }

      // Get account IDs to figure out user profiles
      const accountIds = new Set<string>();
      txData.forEach((t: any) => {
        if (t.from_account_id) accountIds.add(t.from_account_id);
        if (t.to_account_id) accountIds.add(t.to_account_id);
      });

      let profileMap: Record<string, string> = {};
      if (accountIds.size > 0) {
        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("id, user_id")
          .in("id", Array.from(accountIds));

        if (accounts) {
          const profileIds = [...new Set(accounts.map((a: any) => a.user_id))];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", profileIds);

          if (profiles) {
            profiles.forEach((p: any) => {
              profileMap[p.id] = p.full_name || "Unknown";
            });
          }
        }
      }

      // Get POV code info for each transaction
      const txIdToPov: Record<string, { attempts: number; max_attempts: number }> = {};
      const { data: povCodes } = await supabase
        .from("pov_codes")
        .select("transaction_id, attempts, max_attempts")
        .in("transaction_id", txData.map((t: any) => t.id));

      if (povCodes) {
        povCodes.forEach((pc: any) => {
          txIdToPov[pc.transaction_id] = { attempts: pc.attempts, max_attempts: pc.max_attempts };
        });
      }

      // Build items - get user name from first matching account
      const accountUserMap: Record<string, string> = {};
      if (accountIds.size > 0) {
        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("id, user_id")
          .in("id", Array.from(accountIds));
        if (accounts) {
          accounts.forEach((a: any) => {
            accountUserMap[a.id] = a.user_id;
          });
        }
      }

      const items: PoVItem[] = txData.map((t: any) => {
        const goodAccountId = t.from_account_id || t.to_account_id || "";
        const profileId = goodAccountId ? accountUserMap[goodAccountId] || "" : "";
        const povInfo = txIdToPov[t.id] || { attempts: 0, max_attempts: 3 };
        return {
          transaction_ref: t.transaction_ref,
          user_name: profileId ? profileMap[profileId] || "Unknown" : "Unknown",
          amount: Number(t.amount),
          created_at: t.created_at || "",
          attempts: povInfo.attempts,
          max_attempts: povInfo.max_attempts,
        };
      });

      setPovItems(items);
    } catch (err) {
      console.error("Failed to fetch POV items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPovItems();
  }, [fetchPovItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">Transactions flagged for POV verification. Generate codes for support to give to users.</p>
      {povItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No POV-pending transactions</div>
      ) : (
        povItems.map((p, i) => (
          <Card key={p.transaction_ref + "-" + i} className="p-4 border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">{p.user_name}</p>
                <p className="text-xs text-muted-foreground">{p.transaction_ref} · ${p.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleString() : "N/A"} · {p.attempts}/{p.max_attempts} attempts</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => toast.success("POV code: 482916 (share with user)")}>
                  <Shield className="w-3 h-3 mr-1" /> Generate Code
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success("POV bypassed")}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Bypass
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ---- Support Tab ----

function SupportTab() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <div className="text-center py-8 text-muted-foreground text-sm">No support tickets</div>;
  }

  return (
    <div className="space-y-3">
      {tickets.map(t => (
        <Card key={t.id} className="p-4 border-border bg-card">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-foreground">{t.subject}</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  t.priority === "urgent" ? "bg-red-500/10 text-red-500" :
                  t.priority === "high" ? "bg-orange-500/10 text-orange-500" :
                  t.priority === "low" ? "bg-green-500/10 text-green-500" :
                  "bg-muted text-muted-foreground"
                }`}>{t.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground">Ticket · {t.id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">{t.created_at ? new Date(t.created_at).toLocaleString() : "N/A"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                t.status === "open" ? "bg-yellow-500/10 text-yellow-500" :
                t.status === "in_progress" ? "bg-blue-500/10 text-blue-500" :
                t.status === "resolved" || t.status === "closed" ? "bg-green-500/10 text-green-500" :
                "bg-muted text-muted-foreground"
              }`}>{t.status.replace("_", " ")}</span>
              <Button size="sm" variant="outline" className="text-xs"><MessageSquare className="w-3 h-3 mr-1" /> Respond</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---- Settings Tab ----

function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value");

      if (data) {
        const map: Record<string, any> = {};
        data.forEach((s: { key: string; value: any }) => {
          map[s.key] = s.value;
        });
        setSettings(map);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="p-4 sm:p-6 border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">POV Probability (%)</label>
            <Input type="number" defaultValue={settings.pov_probability ?? 80} className="bg-background border-border w-32" />
            <p className="text-xs text-muted-foreground mt-1">Chance a transaction gets flagged for POV verification</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Default Daily Transfer Limit</label>
            <Input type="number" defaultValue={settings.daily_transfer_limit ?? 10000} className="bg-background border-border w-40" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Default Interest Rate (%)</label>
            <Input type="number" step="0.01" defaultValue={settings.default_interest_rate ?? 4.50} className="bg-background border-border w-32" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Bank Name</label>
            <Input defaultValue={settings.bank_name ?? "StateBank"} className="bg-background border-border max-w-xs" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Routing Number</label>
            <Input defaultValue={settings.routing_number ?? "021000021"} className="bg-background border-border w-40" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success("Settings saved")}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}