"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  AlertTriangle,
  Info,
  ArrowRight,
  Banknote,
  Users,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

/* ── Transfer Page ───────────────────────────────────────────── */
export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("");
  const [transferType, setTransferType] = useState<"internal" | "external" | "beneficiary">("internal");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const accounts = [
    { id: "chk-8842", label: "Premium Checking (••••8842) - $45,280.50" },
    { id: "sav-5567", label: "High-Yield Savings (••••5567) - $128,500.00" },
    { id: "bus-2219", label: "Business Account (••••2219) - $89,200.00" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    setIsLoading(true);
    // Simulate transfer
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);

    toast.success("Transfer initiated successfully!");
    setAmount("");
    setDescription("");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-sm">
            <ArrowUpDown className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Transfer Funds
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Send money between your accounts or to others.
            </p>
          </div>
        </div>
      </motion.div>

      {/* POV Warning */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-300">POV Security Notice</p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">
              For your security, all transfers are protected by POV (Point of Verification)
              authentication. You may be asked to enter a POV code sent to your registered
              device before the transfer is processed. Never share your POV codes with anyone.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transfer Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">New Transfer</CardTitle>
            <CardDescription>
              Fill in the details below to initiate a transfer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Transfer Type */}
              <div className="flex gap-2 rounded-xl border border-border bg-bg-surface/50 p-1">
                {[
                  { value: "internal", label: "Internal", icon: Building2 },
                  { value: "external", label: "External", icon: Banknote },
                  { value: "beneficiary", label: "Beneficiary", icon: Users },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTransferType(type.value as typeof transferType)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      transferType === type.value
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </button>
                ))}
              </div>

              {/* From Account */}
              <div className="space-y-1.5">
                <Label htmlFor="from-account">From Account</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger id="from-account">
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Account */}
              <div className="space-y-1.5">
                <Label htmlFor="to-account">
                  {transferType === "internal"
                    ? "To Account"
                    : transferType === "beneficiary"
                    ? "Select Beneficiary"
                    : "External Account Number"}
                </Label>

                {transferType === "internal" ? (
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger id="to-account">
                      <SelectValue placeholder="Select destination account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts
                        .filter((a) => a.id !== fromAccount)
                        .map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : transferType === "beneficiary" ? (
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger id="to-account">
                      <SelectValue placeholder="Select a saved beneficiary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ben-1">Jane Smith - Savings</SelectItem>
                      <SelectItem value="ben-2">Acme Corp - Business</SelectItem>
                      <SelectItem value="ben-3">Sarah Johnson - Checking</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="to-account"
                    placeholder="Enter external account number"
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                  />
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted font-medium">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What's this transfer for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 rounded-lg border border-border bg-bg-surface/50 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Transfers between StateBank accounts are instant and free. External
                  transfers may take 1-3 business days. Daily transfer limit: $50,000.
                </p>
              </div>

              {/* Submit */}
              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="Processing Transfer..."
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                <ArrowRight className="h-5 w-5" />
                Review Transfer
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
