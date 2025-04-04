import type React from "react";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="h-10 w-auto" />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            Welcome to GST360
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your all-in-one business solution for GST compliance and management
          </p>
        </div>
        <div className="w-full bg-white p-8 shadow rounded-lg">{children}</div>
      </div>
    </div>
  );
}
