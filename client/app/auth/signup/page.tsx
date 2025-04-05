"use client";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div>
      <SignupForm />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
        Want to try with test credentials?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Test
          </Link>
        </p>
      </div>
    </div>
  );
}
