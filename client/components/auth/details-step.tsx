"use client";

import { Button } from "@/components/ui/button";
import type { GSTDetails } from "@/types/auth";
import { CheckCircle } from "lucide-react";

interface DetailsStepProps {
  details: GSTDetails;
  onConfirm: () => void;
  onBack: () => void;
}

export function DetailsStep({ details, onConfirm, onBack }: DetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Confirm Business Details</h3>
        <p className="text-sm text-gray-500">
          Please verify the information fetched from the GST portal
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">GSTN Verified</p>
            <p className="text-sm text-blue-600">{details.gstin}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Trade Name</p>
            <p className="font-medium">{details.tradeName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Legal Name</p>
            <p className="font-medium">{details.legalName}</p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="font-medium">{details.address}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <div className="flex items-center">
              <span
                className={`inline-block h-2 w-2 rounded-full mr-2 ${
                  details.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <p className="font-medium">{details.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="sm:flex-1">
          Back
        </Button>
        <Button onClick={onConfirm} className="sm:flex-1">
          Confirm & Continue
        </Button>
      </div>
    </div>
  );
}
