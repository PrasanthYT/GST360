"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface GSTNStepProps {
  onSubmit: (gstin: string) => void;
  loading: boolean;
}

export function GSTNStep({ onSubmit, loading }: GSTNStepProps) {
  const [gstin, setGstin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!gstin) {
      setError("GSTN is required");
      return;
    }

    // GSTN format validation (simplified for demo)
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin)) {
      setError("Please enter a valid GSTN");
      return;
    }

    setError("");
    onSubmit(gstin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Enter your GSTN</h3>
        <p className="text-sm text-gray-500">
          We&apos;ll fetch your business details automatically from the GST portal
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gstin">GSTN Number</Label>
        <Input
          id="gstin"
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          placeholder="e.g. 27AAPFU0939F1ZV"
          className="uppercase"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify & Continue"
        )}
      </Button>
    </form>
  );
}
