"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  ChevronDown,
  CircleArrowOutUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ── Mock account data ──────────────────────────────────────── */
const accounts = {
  "1": {
    id: "1",
    name: "Premium Checking",
    type: "Checking",
    number: "•••• 8842",
    accountNumber: "SB-4002-8842-1193",
    balance: 45280.50,
    available: 45280.50,
    currency: "USD",
    status: "active",
    routing: "021000021",
    opened: "Jan 15, 2025",
    icon: Wallet,
  },
  "2": {
    id: "2",
    name: "High-Yield Savings",
    type: "Savings",
    number: "•••• 5567",
    accountNumber: "SB-7001-5567-4421",
    balance: 128500.00,
    available: 128500.00,
    currency: "USD",
    status: "active",
    routing: "021000021",
    opened: "Mar 3, 2025",
    icon: PiggyBank,
  },
  "3": {
    id: "3",
    name: "Platinum Credit Card",
    type: "Credit",
    number: "•••• 3391",
    accountNumber: "SB-9003-3391-7782",
    balance: 4500.00,
    available: 5500.00,
    currency: "USD",
    status: "active",
    routing: "021000021",
    opened: "Feb 20, 2025",
    icon: CreditCard,
  },
  "4": {
    id: "4",
    name: "Business Account",
    type: "Business Checking",
    number: "•••• 2219",
    accountNumber: "SB-6005-2219-3340",
    balance: 89200.00,
    available: 89200.00,
    currency: "USD",
    status: "active",
    routing: "021000021",
    opened: "Apr 10, 2025",
    icon: Wallet,
  },
};

/* ── Mock transactions ──────────────────────────────────────── */
const allTransactions = [
  { id: "tx1", description: "Wire Transfer - John Doe", amount: -2500, date: "2026-06-01", time: "2:34 PM", type: "outgoing", status: "completed", reference: "SB-W-20260601-8842" },
  { id: "tx2", description: "Salary Deposit - Acme Corp", amount: 8750, date: "2026-06-01", time: "9:15 AM", type: "incoming", status: "completed", reference: "SB-D-20260601-8842" },
  { id: "tx3", description: "Amazon.com Purchase", amount: -189.99, date: "2026-05-31", time: "4:22 PM", type: "outgoing", status: "completed", reference: "SB-C-20260531-8842" },
  { id: "tx4", description: "Transfer from Savings", amount: 500, date: "2026-05-31", time: "1:00 PM", type: "incoming", status: "completed", reference: "SB-T-20260531-8842" },
  { id: "tx5", description: "Netflix Subscription", amount: -15.99, date: "2026-05-30", time: "3:00 AM", type: "outgoing", status: "completed", reference: "SB-C-20260530-8842" },
  { id: "tx6", description: "Interest Payment", amount: 12.43, date: "2026-05-30", time: "12:00 AM", type: "incoming", status: "completed", reference: "SB-I-20260530-8842" },
  { id: "tx7", description: "ATM Withdrawal", amount: -200, date: "2026-05-29", time: "10:30 AM", type: "outgoing", status: "completed", reference: "SB-A-20260529-8842" },
  { id: "tx8", description: "Direct Deposit - Freelance", amount: 3200, date: "2026-05-28", time: "11:00 AM", type: "incoming", status: "pending", reference: "SB-D-20260528-8842" },
  { id: "tx9", description: "Electric Bill Payment", amount: -185.40, date: "2026-05-27", time: "8:00 AM", type: "outgoing", status: "completed", reference: "SB-B-20260527-8842" },
  { id: "tx10", description: "Transfer to Savings", amount: -2000, date: "2026-05-26", time: "2:00 PM", type: "outgoing", status: "completed", reference: "SB-T-20260526-8842" },
];

/* ──── Status helpers ────────────────────────────────────────── */
const statusConfig = {
  completed: { icon: CheckCircle2, class: "text-success" },
  pending: { icon: Clock, class: "text-amber-400" },
  failed: { icon: XCircle, class: "text-destructive" },
};

/* ── Currency formatter ─────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* ── Account Detail Page ─────────────────────────────────────── */
export default function AccountDetailPage() {
  const params = useParams();
  const { id } = params;
  const account = accounts[id as keyof typeof accounts];
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted">Account not found</p>
        <Link
          href="/dashboard/accounts"
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80"
        >
          ← Back to Accounts
        </Link>
      </div>
    );
  }

  const filteredTxs =
    statusFilter === "all"
      ? allTransactions
      : allTransactions.filter((tx) => tx.status === statusFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Back link */}
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounts
      </Link>

      {/* Account Header */}
      <Card className="relative overflow-hidden border-border">
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700`} />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <account.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">
                  {account.name}
                </h1>
                <p className="mt-0.5 text-sm text-text-secondary">{account.type} Account</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-lg border border-border bg-bg-surface/50 px-2.5 py-1 font-mono text-text-muted">
                    {account.accountNumber}
                  </span>
                  <span className="rounded-lg border border-border bg-bg-surface/50 px-2.5 py-1 font-mono text-text-muted">
                    Routing: {account.routing}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-text-muted">Current Balance</p>
              <p className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {fmt(account.balance)}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Available: {fmt(account.available)}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
            <Link
              href="/dashboard/transfer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-all hover:bg-primary/90"
            >
              <ArrowUpRight className="h-4 w-4" />
              Send Money
            </Link>
            <Link
              href="/dashboard/deposit"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium text-text-secondary transition-all hover:bg-accent hover:text-text-primary"
            >
              <ArrowDownRight className="h-4 w-4" />
              Deposit
            </Link>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium text-text-secondary transition-all hover:bg-accent hover:text-text-primary">
              <Download className="h-4 w-4" />
              Download Statement
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
          <CardTitle className="text-lg font-semibold text-text-primary">
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted">
              <Filter className="h-3.5 w-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-text-secondary outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-accent hover:text-text-primary">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTxs.map((tx, i) => {
                  const StatusIcon = statusConfig[tx.status as keyof typeof statusConfig]?.icon || CheckCircle2;
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group transition-colors hover:bg-accent/50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              tx.type === "incoming"
                                ? "bg-success/10"
                                : "bg-destructive/10"
                            )}
                          >
                            {tx.type === "incoming" ? (
                              <ArrowDownRight className="h-4 w-4 text-success" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {tx.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-text-secondary">{tx.date}</p>
                        <p className="text-xs text-text-muted">{tx.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium">
                          <StatusIcon
                            className={cn(
                              "h-3.5 w-3.5",
                              statusConfig[tx.status as keyof typeof statusConfig]?.class
                            )}
                          />
                          <span className="capitalize text-text-secondary">
                            {tx.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            tx.type === "incoming" ? "text-success" : "text-text-primary"
                          )}
                        >
                          {tx.type === "incoming" ? "+" : ""}
                          {fmt(Math.abs(tx.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-mono text-text-muted">
                          {tx.reference}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTxs.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-text-muted">No transactions found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}