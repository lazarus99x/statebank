"use client";

import { motion } from "framer-motion";
import { Users, Plus, ArrowUpRight, Mail, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BeneficiariesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 shadow-sm">
          <Users className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Beneficiaries</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage your trusted beneficiaries for easy transfers.</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Saved Beneficiaries</CardTitle>
            <CardDescription>Quickly send money to people you trust.</CardDescription>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Jane Smith", account: "•••• 4421", bank: "Chase Bank", email: "jane@example.com", recent: true },
            { name: "Acme Corporation", account: "•••• 8890", bank: "Bank of America", email: "payments@acme.com", recent: false },
            { name: "Sarah Johnson", account: "•••• 2233", bank: "Wells Fargo", email: "sarah.j@example.com", recent: false },
          ].map((ben, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-bg-surface/50 p-3.5 transition-colors hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-bold text-primary">
                  {ben.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {ben.name}
                    {ben.recent && (
                      <span className="ml-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Recent
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-text-muted">{ben.bank} &middot; {ben.account}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Transfer
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
