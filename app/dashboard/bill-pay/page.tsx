"use client";

import { motion } from "framer-motion";
import { Receipt, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BillPayPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 shadow-sm">
          <Receipt className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Bill Pay</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage and pay your bills from one place.</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Bills</CardTitle>
          <CardDescription>You have no scheduled bills. Add a payee to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Electric Company", amount: 185.40, due: "Jun 15, 2026", status: "upcoming" },
            { name: "Internet Service", amount: 79.99, due: "Jun 20, 2026", status: "upcoming" },
            { name: "Water Utility", amount: 45.20, due: "Jun 25, 2026", status: "upcoming" },
          ].map((bill, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-bg-surface/50 p-3.5">
              <div>
                <p className="text-sm font-medium text-text-primary">{bill.name}</p>
                <p className="text-xs text-text-muted mt-0.5">Due {bill.due}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-primary">
                  ${bill.amount.toFixed(2)}
                </span>
                <Button size="sm" variant="outline" className="text-xs">
                  Pay Now
                </Button>
              </div>
            </div>
          ))}
          <Button className="w-full h-11 rounded-xl">
            <ArrowRight className="h-4 w-4" />
            Add New Payee
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
