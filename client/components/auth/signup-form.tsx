"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { GSTNStep } from "@/components/auth/gstn-step";
import { DetailsStep } from "@/components/auth/details-step";
import { PasswordStep } from "@/components/auth/password-step";
import type { GSTDetails, SignupFormData } from "@/types/auth";
import { CheckCircle2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");


  const handleGSTNSubmit = async (gstin: string) => {
    setLoading(true);
    setApiError("");
  
    try {
      const response = await fetch("http://localhost:4000/api/gstn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gstin }),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data || !data.gstNumber) {
        throw new Error(data.message || "No GST details found for this number");
      }
  
      setFormData((prev) => ({ ...prev, ...data }));
      setCurrentStep(2);
    } catch (error) {
      console.error("Error fetching GST details:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to fetch GST details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDetailsConfirm = () => {
    setCurrentStep(3);
  };

  const handlePasswordSubmit = async (password: string) => {
    setLoading(true);
    try {
      const completeFormData = { 
        ...formData, 
        password,
        address: formData.address || {
          bnm: "Not Available",
          st: "Not Available",
          loc: "Not Available",
          bno: "Not Available",
          stcd: "Not Available",
          pncd: "Not Available"
        }
      };
  
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: completeFormData.legalName,
          gstNumber: completeFormData.gstNumber,
          tradeName: completeFormData.tradeName,
          legalName: completeFormData.legalName,
          address: completeFormData.address,
          status: completeFormData.status,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      // Redirect after success
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const steps = [
    { number: 1, title: "GSTN Verification" },
    { number: 2, title: "Business Details" },
    { number: 3, title: "Set Password" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  currentStep > step.number
                    ? "bg-blue-600 text-white border-blue-600"
                    : currentStep === step.number
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 sm:w-24 ${
                    currentStep > step.number + 1
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm ${
                currentStep >= step.number
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-6">
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {apiError}
          </div>
        )}
        
        {currentStep === 1 && (
          <GSTNStep onSubmit={handleGSTNSubmit} loading={loading} />
        )}

        {currentStep === 2 && formData && (
          <DetailsStep
            details={formData as GSTDetails}
            onConfirm={handleDetailsConfirm}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <PasswordStep
            onSubmit={handlePasswordSubmit}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </Card>
    </div>
  );
}