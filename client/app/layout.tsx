import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { InventoryProvider } from "@/contexts/inventory-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GST360 - All-in-One Business Solution",
  description:
    "Simplify business operations with integrated inventory management, POS, GST compliance, and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  );
}
