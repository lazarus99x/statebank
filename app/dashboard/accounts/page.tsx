"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ── Accounts data ──────────────────────────────────────────── */
const accounts = [
  {
    id: "1",
    name: "Premium Checking",
    type: "Checking",
    number: "•••• 8842",
    accountNumber: "SB-4002-8842-1193",
    balance: 45280.50,
    available: 45280.50,
    currency: "USD",
    status: "active",
    change: "+2.4%",
    icon: Wallet,
    gradient: "from-blue-500 to-blue-600",
    opened: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "High-Yield Savings",
    type: "Savings",
    number: "•••• 5567",
    accountNumber: "SB-7001-5567-4421",
    balance: 128500.00,
    available: 128500.00,
    currency: "USD",
    status: "active",
    change: "+4.1%",
    icon: PiggyBank,
    gradient: "from-emerald-500 to-emerald-600",
    opened: "Mar 3, 2025",
  },
  {
    id: "3",
    name: "Platinum Credit Card",
    type: "Credit",
    number: "•••• 3391",
    accountNumber: "SB-9003-3391-7782",
    balance: 4500.00,
    available: 5500.00,
    currency: "USD",
    status: "active",
    change: "-$2,300",
    icon: CreditCard,
    gradient: "from-purple-500 to-purple-600",
    opened: "Feb 20, 2025",
  },
  {
    id: "4",
    name: "Business Account",
    type: "Business Checking",
    number: "•••• 2219",
    accountNumber: "SB-6005-2219-3340",
    balance: 89200.00,
    available: 89200.00,
    currency: "USD",
    status: "active",
    change: "+12.8%",
    icon: Wallet,
    gradient: "from-amber-500 to-amber-600",
    opened: "Apr 10, 2025",
  },
];

/* ── Currency formatter ─────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* ── Container variants ─────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Accounts Page ───────────────────────────────────────────── */
export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            My Accounts
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all your StateBank accounts in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-text-muted transition-colors hover:bg-accent hover:text-text-primary"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          <Button className="h-9 gap-1.5">
            <Plus className="h-4 w-4" />
            Open Account
          </Button>
        </div>
      </motion.div>

      {/* Summary bar */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Balance", value: fmt(totalBalance), change: "+6.2%" },
            { label: "Active Accounts", value: "4", change: "" },
            { label: "This Month Interest", value: fmt(312.43), change: "" },
            { label: "Available Credit", value: fmt(5500), change: "" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <p className="text-xs text-text-muted">{stat.label}</p>
                <p className="mt-1 font-display text-xl font-bold text-text-primary">
                  {showBalances || stat.label === "Active Accounts"
                    ? stat.value
                    : "••••••"}
                </p>
                {stat.change && (
                  <p className="mt-0.5 text-xs font-medium text-success">{stat.change}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Accounts grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/dashboard/accounts/${account.id}`}
            className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-text-muted hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Gradient accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${account.gradient}`} />

            <div className="flex items-start justify-between mt-1">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${account.gradient} shadow-sm`}>
                  <account.icon className="h-5.5 w-5.5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {account.name}
                  </h3>
                  <p className="text-xs text-text-muted">{account.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  {account.status}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-text-muted">Account Number</p>
                <p className="font-mono text-sm font-semibold text-text-primary">
                  {account.accountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Balance</p>
                <p className="font-display text-lg font-bold text-text-primary">
                  {showBalances ? fmt(account.balance) : "••••••"}
                </p>
                <p className={cn(
                  "mt-0.5 text-xs font-medium",
                  account.change.startsWith("+") ? "text-success" : "text-destructive"
                )}>
                  {account.change} this month
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-text-muted">Opened {account.opened}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                View Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
