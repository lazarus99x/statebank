"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Building2, ArrowUpDown, Download, Upload, DollarSign, Shield, Headphones, Settings,
  Search, CheckCircle, XCircle, Clock, Ban, Trash2, Key, ChevronDown, ChevronUp,
  TrendingUp, BarChart3, FileText, Wallet, RefreshCw, MessageSquare, Plus
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

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

function OverviewTab() {
  const stats = [
    { label: "Total Users", value: "2,847", icon: Users, color: "text-blue-500", change: "+12%", positive: true },
    { label: "Total Accounts", value: "4,123", icon: Building2, color: "text-green-500", change: "+8%", positive: true },
    { label: "Pending Txns", value: "23", icon: Clock, color: "text-yellow-500", change: "12 need action" },
    { label: "Pending Deposits", value: "8", icon: Download, color: "text-cyan-500", change: "$45,230" },
    { label: "Pending Withdrawals", value: "5", icon: Upload, color: "text-orange-500", change: "$12,800" },
    { label: "Active Loans", value: "156", icon: DollarSign, color: "text-purple-500", change: "$2.4M outstanding" },
    { label: "Total Volume", value: "$8.2M", icon: TrendingUp, color: "text-emerald-500", change: "+23% this month" },
    { label: "POV Pending", value: "14", icon: Shield, color: "text-red-500", change: "80% flag rate" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <Card key={i} className="p-4 border-border bg-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className={`text-xs mt-1 ${s.positive !== undefined ? (s.positive ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`}>{s.change}</p>
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
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => {
            const mockAmounts = [4500.00, 2500.00, 12000.50, 350.75, 890.25];
            const mockStatuses = ["Completed", "Pending POV", "Completed", "Failed", "Completed"];
            return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${i % 2 === 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {i % 2 === 0 ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{i % 2 === 0 ? "Deposit" : "Withdrawal"}</p>
                  <p className="text-xs text-muted-foreground">TXN-20260601-{String(1000 + i).slice(1)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                  {i % 2 === 0 ? "+" : "-"}${mockAmounts[i].toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{mockStatuses[i]}</p>
              </div>
            </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAccount, setDepositAccount] = useState("");

  const users = [
    { id: "USR-001", name: "John Doe", email: "john@email.com", accounts: 2, balance: 45230, status: "active", kyc: "verified", phone: "+1 555-0101" },
    { id: "USR-002", name: "Jane Smith", email: "jane@email.com", accounts: 1, balance: 12800, status: "active", kyc: "pending", phone: "+1 555-0102" },
    { id: "USR-003", name: "Bob Johnson", email: "bob@email.com", accounts: 3, balance: 89000, status: "frozen", kyc: "verified", phone: "+1 555-0103" },
  ];

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="bg-background border-border" />
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map(u => (
          <Card key={u.id} className="border-border bg-card overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.kyc === "verified" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>{u.kyc}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{u.status}</span>
                {expanded === u.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === u.id && (
              <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs">Phone:</span><p className="text-foreground font-medium">{u.phone}</p></div>
                  <div><span className="text-muted-foreground text-xs">Accounts:</span><p className="text-foreground font-medium">{u.accounts}</p></div>
                  <div><span className="text-muted-foreground text-xs">Balance:</span><p className="text-foreground font-medium">${u.balance.toLocaleString()}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => { setShowDeposit(true); toast.info("Deposit form opened"); }}>
                    <Download className="w-3 h-3 mr-1" /> Deposit
                  </Button>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                    <Upload className="w-3 h-3 mr-1" /> Withdraw
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="w-3 h-3 mr-1" /> Limits
                  </Button>
                  <Button size="sm" variant={u.status === "active" ? "destructive" : "default"} className="text-xs">
                    <Ban className="w-3 h-3 mr-1" /> {u.status === "active" ? "Ban" : "Unban"}
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

                {showDeposit && (
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
    </div>
  );
}

function TransactionsTab() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const txs = [
    { id: "TXN-001", ref: "TXN-20260601-0001", type: "deposit", amount: 5000, status: "pending", from: "External", to: "STBK-4829-1736-04", date: "2026-06-01", pov: false },
    { id: "TXN-002", ref: "TXN-20260601-0002", type: "transfer", amount: 2500, status: "pending_pov", from: "STBK-4829-1736-04", to: "STBK-3918-2745-01", date: "2026-06-01", pov: true },
    { id: "TXN-003", ref: "TXN-20260601-0003", type: "withdrawal", amount: 1200, status: "completed", from: "STBK-4829-1736-04", to: "External", date: "2026-05-31", pov: false },
    { id: "TXN-004", ref: "TXN-20260601-0004", type: "deposit", amount: 10000, status: "completed", from: "Wire Transfer", to: "STBK-3918-2745-01", date: "2026-05-30", pov: false },
    { id: "TXN-005", ref: "TXN-20260601-0005", type: "payment", amount: 350, status: "failed", from: "STBK-4829-1736-04", to: "Electric Co.", date: "2026-05-29", pov: false },
  ];

  const filtered = filter === "all" ? txs : txs.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <Card className="p-4 border-border bg-card">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "pending", "pending_pov", "completed", "failed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "all" ? "All" : f === "pending_pov" ? "POV Pending" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map(tx => (
          <Card key={tx.id} className="border-border bg-card overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === tx.id ? null : tx.id)}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-full shrink-0 ${tx.type === "deposit" ? "bg-green-500/10 text-green-500" : tx.type === "withdrawal" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                  {tx.type === "deposit" ? <Download className="w-4 h-4" /> : tx.type === "withdrawal" ? <Upload className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground capitalize">{tx.type} · ${tx.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{tx.ref}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  tx.status === "completed" ? "bg-green-500/10 text-green-500" :
                  tx.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                  tx.status === "pending_pov" ? "bg-red-500/10 text-red-500" :
                  "bg-red-500/10 text-red-500"
                }`}>{tx.status.replace("_", " ")}</span>
                {expanded === tx.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === tx.id && (
              <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs">From:</span><p className="text-foreground">{tx.from}</p></div>
                  <div><span className="text-muted-foreground text-xs">To:</span><p className="text-foreground">{tx.to}</p></div>
                  <div><span className="text-muted-foreground text-xs">Date:</span><p className="text-foreground">{tx.date}</p></div>
                  <div><span className="text-muted-foreground text-xs">POV Required:</span><p className={tx.pov ? "text-red-500" : "text-green-500"}>{tx.pov ? "Yes" : "No"}</p></div>
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
        ))}
      </div>
    </div>
  );
}

function DepositsTab() {
  const pendingDeposits = [
    { ref: "TXN-20260601-0001", user: "John Doe", amount: 5000, account: "STBK-4829-1736-04", date: "2026-06-01" },
    { ref: "TXN-20260601-0006", user: "Jane Smith", amount: 2500, account: "STBK-3918-2745-01", date: "2026-06-01" },
    { ref: "TXN-20260601-0007", user: "Alice Brown", amount: 12000, account: "STBK-7342-8193-02", date: "2026-05-31" },
  ];

  return (
    <div className="space-y-3">
      {pendingDeposits.map(d => (
        <Card key={d.ref} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{d.user}</p>
              <p className="text-xs text-muted-foreground">{d.ref} · {d.account}</p>
              <p className="text-xs text-muted-foreground">{d.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-500">+${d.amount.toLocaleString()}</p>
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
      {pendingDeposits.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">No pending deposits</div>
      )}
    </div>
  );
}

function WithdrawalsTab() {
  const pending = [
    { ref: "TXN-20260601-0008", user: "Bob Johnson", amount: 3500, account: "STBK-1234-5678-03", date: "2026-06-01" },
    { ref: "TXN-20260601-0009", user: "Jane Smith", amount: 800, account: "STBK-3918-2745-01", date: "2026-05-31" },
  ];

  return (
    <div className="space-y-3">
      {pending.map(w => (
        <Card key={w.ref} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{w.user}</p>
              <p className="text-xs text-muted-foreground">{w.ref} · {w.account}</p>
              <p className="text-xs text-muted-foreground">{w.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-500">-${w.amount.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
            <Button size="sm" variant="destructive" className="flex-1 text-xs"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
          </div>
        </Card>
      ))}
      {pending.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No pending withdrawals</div>}
    </div>
  );
}

function LoansTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const loans = [
    { id: "LN-001", user: "John Doe", type: "Personal", principal: 25000, rate: 8.5, months: 24, monthly: 1134, status: "pending", remaining: 25000 },
    { id: "LN-002", user: "Jane Smith", type: "Business", principal: 100000, rate: 6.0, months: 60, monthly: 1933, status: "active", remaining: 85000 },
    { id: "LN-003", user: "Bob Johnson", type: "Mortgage", principal: 350000, rate: 4.5, months: 360, monthly: 1773, status: "active", remaining: 320000 },
  ];

  return (
    <div className="space-y-3">
      {loans.map(l => (
        <Card key={l.id} className="border-border bg-card">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === l.id ? null : l.id)}>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{l.user} · {l.type}</p>
              <p className="text-xs text-muted-foreground">{l.id} · ${l.principal.toLocaleString()} @ {l.rate}%</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${l.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>{l.status}</span>
              {expanded === l.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          {expanded === l.id && (
            <div className="px-4 pb-4 border-t pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Monthly:</span><p className="text-foreground">${l.monthly.toLocaleString()}/mo</p></div>
                <div><span className="text-muted-foreground text-xs">Remaining:</span><p className="text-foreground">${l.remaining.toLocaleString()}</p></div>
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

function POVTab() {
  const povPending = [
    { ref: "TXN-20260601-0002", user: "John Doe", amount: 2500, created: "2 min ago", attempts: 0 },
    { ref: "TXN-20260601-0010", user: "Jane Smith", amount: 15000, created: "15 min ago", attempts: 1 },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">80% of transactions require POV codes. Generate codes here for support to give to users.</p>
      {povPending.map(p => (
        <Card key={p.ref} className="p-4 border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">{p.user}</p>
              <p className="text-xs text-muted-foreground">{p.ref} · ${p.amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{p.created} · {p.attempts}/3 attempts</p>
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
      ))}
      {povPending.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No POV-pending transactions</div>}
    </div>
  );
}

function SupportTab() {
  const tickets = [
    { id: "TK-001", user: "John Doe", subject: "Need POV code for transfer", status: "open", priority: "high", date: "2 min ago" },
    { id: "TK-002", user: "Jane Smith", subject: "Cannot log in to my account", status: "in_progress", priority: "urgent", date: "1 hour ago" },
    { id: "TK-003", user: "Alice Brown", subject: "Statement request for last month", status: "resolved", priority: "low", date: "1 day ago" },
  ];

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
                  t.priority === "high" ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"
                }`}>{t.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.user} · {t.id}</p>
              <p className="text-xs text-muted-foreground">{t.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                t.status === "open" ? "bg-yellow-500/10 text-yellow-500" :
                t.status === "in_progress" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
              }`}>{t.status.replace("_", " ")}</span>
              <Button size="sm" variant="outline" className="text-xs"><MessageSquare className="w-3 h-3 mr-1" /> Respond</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="p-4 sm:p-6 border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">POV Probability (%)</label>
            <Input type="number" defaultValue={80} className="bg-background border-border w-32" />
            <p className="text-xs text-muted-foreground mt-1">Chance a transaction gets flagged for POV verification</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Default Daily Transfer Limit</label>
            <Input type="number" defaultValue={10000} className="bg-background border-border w-40" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Default Interest Rate (%)</label>
            <Input type="number" step="0.01" defaultValue={4.50} className="bg-background border-border w-32" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Bank Name</label>
            <Input defaultValue="StateBank" className="bg-background border-border max-w-xs" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Routing Number</label>
            <Input defaultValue="021000021" className="bg-background border-border w-40" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success("Settings saved")}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}