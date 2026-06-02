"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Plus,
  Minus,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";

/* ── Quick Actions ──────────────────────────────────────────── */
const quickActions = [
  { label: "Transfer", href: "/dashboard/transfer", icon: ArrowUpDown, color: "from-blue-500/20 to-blue-600/10", accent: "text-blue-400" },
  { label: "Deposit", href: "/dashboard/deposit", icon: Plus, color: "from-emerald-500/20 to-emerald-600/10", accent: "text-emerald-400" },
  { label: "Withdraw", href: "/dashboard/withdraw", icon: Minus, color: "from-amber-500/20 to-amber-600/10", accent: "text-amber-400" },
  { label: "Pay Bills", href: "/dashboard/bill-pay", icon: Receipt, color: "from-purple-500/20 to-purple-600/10", accent: "text-purple-400" },
];

/* ── Sample transactions ────────────────────────────────────── */
const recentTransactions = [
  { id: 1, description: "Wire Transfer - John Doe", amount: -2500, date: "Today, 2:34 PM", type: "outgoing", account: "Checking ••8842" },
  { id: 2, description: "Salary Deposit - Acme Corp", amount: 8750, date: "Today, 9:15 AM", type: "incoming", account: "Checking ••8842" },
  { id: 3, description: "Amazon.com Purchase", amount: -189.99, date: "Yesterday, 4:22 PM", type: "outgoing", account: "Credit ••3391" },
  { id: 4, description: "Transfer from Savings", amount: 500, date: "Yesterday, 1:00 PM", type: "incoming", account: "Checking ••8842" },
  { id: 5, description: "Netflix Subscription", amount: -15.99, date: "Jun 1, 2026", type: "outgoing", account: "Credit ••3391" },
  { id: 6, description: "Interest Payment", amount: 12.43, date: "Jun 1, 2026", type: "incoming", account: "Savings ••5567" },
];

/* ── Account summary cards ──────────────────────────────────── */
const accounts = [
  { name: "Premium Checking", type: "Checking", number: "•••• 8842", balance: 45280.50, change: "+2.4%", icon: Wallet, gradient: "from-blue-500 to-blue-600" },
  { name: "High-Yield Savings", type: "Savings", number: "•••• 5567", balance: 128500.00, change: "+4.1%", icon: PiggyBank, gradient: "from-emerald-500 to-emerald-600" },
  { name: "Platinum Credit", type: "Credit", number: "•••• 3391", balance: 4500.00, change: "-$2,300", icon: CreditCard, gradient: "from-purple-500 to-purple-600" },
];

/* ── Currency formatter ─────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* ── Item Variants ──────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

/* ── Dashboard Overview Page ─────────────────────────────────── */
export default function DashboardOverview() {
  const [showBalances, setShowBalances] = useState(true);
  const [totalBalance, setTotalBalance] = useState(fmt(173780.50));

  const totalBalanceNum = accounts
    .filter((a) => a.type !== "Credit")
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Good morning, <span className="text-primary">Alex</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here&apos;s your financial overview for today.
          </p>
        </div>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-accent hover:text-text-primary"
        >
          {showBalances ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
      </motion.div>

      {/* Total Balance Card */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-accent-gold/5 to-bg-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Wallet className="h-4 w-4" />
              <span>Total Balance (All Accounts)</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {showBalances ? fmt(totalBalanceNum) : "••••••"}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
                +3.2%
              </span>
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              Updated just now &middot; All accounts healthy
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-4 transition-all hover:border-text-muted hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated ${action.accent} ring-1 ring-border-muted`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-text-primary">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Account Summary Cards + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Cards */}
        <motion.div variants={itemVariants} className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              Your Accounts
            </h2>
            <Link
              href="/dashboard/accounts"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              View All
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts.map((account) => (
              <Link
                key={account.name}
                href="/dashboard/accounts"
                className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-text-muted hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${account.gradient} shadow-sm`}>
                    <account.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-text-muted">{account.number}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-text-primary">{account.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{account.type}</p>
                  <p className="mt-2 font-display text-xl font-bold text-text-primary">
                    {showBalances ? fmt(account.balance) : "••••••"}
                  </p>
                  <p className={cn(
                    "mt-1 text-xs font-medium",
                    account.change.startsWith("+") ? "text-success" : "text-destructive"
                  )}>
                    {account.change} this month
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              Recent Transactions
            </h2>
            <button className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <Card className="border-border">
            <div className="divide-y divide-border">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      tx.type === "incoming"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}>
                      {tx.type === "incoming" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-text-muted">
                        {tx.date} &middot; {tx.account}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "shrink-0 text-sm font-semibold",
                    tx.type === "incoming" ? "text-success" : "text-text-primary"
                  )}>
                    {tx.type === "incoming" ? "+" : ""}{fmt(Math.abs(tx.amount))}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <Link
                href="/dashboard/accounts"
                className="block rounded-lg py-2 text-center text-xs font-medium text-primary transition-colors hover:bg-accent"
              >
                View All Transactions
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
