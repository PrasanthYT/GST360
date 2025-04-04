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

  const handleGSTNSubmit = async (gstin: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to fetch GST details
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const gstDetails: GSTDetails = {
        gstin,
        tradeName: "ABC Enterprises",
        legalName: "ABC Enterprises Private Limited",
        address: "123 Business Park, Sector 5, Noida, Uttar Pradesh, 201301",
        status: "Active",
      };

      setFormData((prev) => ({ ...prev, ...gstDetails }));
      setCurrentStep(2);
    } catch (error) {
      console.error("Error fetching GST details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsConfirm = () => {
    setCurrentStep(3);
  };

  const handlePasswordSubmit = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    // In a real app, this would submit the form data to your API
    console.log("Form submitted:", { ...formData, password });

    // Redirect to login or dashboard
    router.push("/auth/login");
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
