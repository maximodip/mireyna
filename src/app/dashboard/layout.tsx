import type React from "react";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { getUserRole } from "../actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getUserRole();

  if (userRole !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
