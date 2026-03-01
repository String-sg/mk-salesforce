import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "./context/RoleContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import AppShell from "./components/layout/AppShell";

export const metadata: Metadata = {
  title: "MKPI - Child Success | Salesforce Education Cloud",
  description: "MOE Kindergarten Performance Indicator System - Salesforce Education Cloud Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>
          <AssessmentProvider>
            <AppShell>
              {children}
            </AppShell>
          </AssessmentProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
