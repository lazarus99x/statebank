"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  AlertTriangle,
  Info,
  ArrowRight,
  Landmark,
  CreditCard,
  Wallet,
  Shield,
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

/* ── Withdraw Page ───────────────────────────────────────────── */
export default function WithdrawPage() {
  const [account, setAccount] = useState("");
  const [method, setMethod] = useState("wire");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);

    toast.success("Withdrawal request submitted for review!");
    setAmount("");
    setNotes("");
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 shadow-sm">
            <Minus className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Withdraw Funds
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Request a withdrawal from your StateBank accounts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* POV Security Notice */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-300">Security Review Required</p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">
              Withdrawals are subject to POV authentication and may require manual review
              for amounts over $10,000 per federal regulations. You will receive a POV code
              on your registered device to authorize this transaction.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Withdrawal Form */}
      <motion.div variants={itemVariants}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Withdrawal Request</CardTitle>
            <CardDescription>
              Select an account and method to withdraw your funds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* From Account */}
              <div className="space-y-1.5">
                <Label htmlFor="withdraw-account">Withdraw From</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger id="withdraw-account">
                    <SelectValue placeholder="Select account to withdraw from" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chk-8842">
                      Premium Checking (••••8842) - $45,280.50
                    </SelectItem>
                    <SelectItem value="sav-5567">
                      High-Yield Savings (••••5567) - $128,500.00
                    </SelectItem>
                    <SelectItem value="bus-2219">
                      Business Account (••••2219) - $89,200.00
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Withdrawal Method */}
              <div className="space-y-1.5">
                <Label>Withdrawal Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "wire", label: "Wire Transfer", icon: Landmark, desc: "1-2 business days" },
                    { id: "ach", label: "ACH Transfer", icon: Wallet, desc: "2-3 business days" },
                    { id: "check", label: "Paper Check", icon: CreditCard, desc: "5-7 business days" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMethod(opt.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                        method === opt.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-text-muted hover:bg-accent"
                      }`}
                    >
                      <opt.icon
                        className={`h-5 w-5 ${
                          method === opt.id ? "text-primary" : "text-text-muted"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          method === opt.id ? "text-primary" : "text-text-secondary"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-text-muted">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted font-medium">
                    $
                  </span>
                  <Input
                    id="withdraw-amount"
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

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="withdraw-notes">Notes (Optional)</Label>
                <Input
                  id="withdraw-notes"
                  placeholder="Reason for withdrawal"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 rounded-lg border border-border bg-bg-surface/50 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Withdrawal limits: $10,000 per day for wire/ACH, $5,000 per day for paper check.
                    Amounts over $10,000 may be subject to federal reporting requirements (CTR).
                  </p>
                </div>
              </div>

              {/* Submit */}
              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="Submitting Request..."
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-amber-500/20"
                variant="default"
              >
                <Shield className="h-5 w-5" />
                Submit Withdrawal Request
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}