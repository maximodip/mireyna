"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const supabase = createClient();

  return (
    <Button onClick={() => supabase.auth.signOut()}>
      <LogOut />
    </Button>
  );
}
