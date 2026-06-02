"use client";

import { motion } from "framer-motion";
import { Landmark, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoansPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 shadow-sm">
          <Landmark className="h-6 w-6 text-rose-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Loans</h1>
          <p className="mt-1 text-sm text-text-secondary">View and manage your loans.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Personal Loan</CardTitle>
            <CardDescription>Loan #LN-2025-001</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Principal</span>
              <span className="font-medium text-text-primary">$25,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Remaining</span>
              <span className="font-medium text-text-primary">$18,450.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Monthly Payment</span>
              <span className="font-medium text-text-primary">$520.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Interest Rate</span>
              <span className="font-medium text-text-primary">6.5% APR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Next Payment</span>
              <span className="font-medium text-text-primary">Jul 1, 2026</span>
            </div>
            <Button variant="outline" className="w-full mt-2">Make Payment</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Apply for a Loan</CardTitle>
            <CardDescription>Find the right loan for your needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Personal Loan", "Home Mortgage", "Auto Loan", "Business Loan"].map((loan) => (
              <div key={loan} className="flex items-center justify-between rounded-lg border border-border bg-bg-surface/50 p-3">
                <span className="text-sm font-medium text-text-primary">{loan}</span>
                <span className="text-xs text-primary font-medium">Apply →</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
