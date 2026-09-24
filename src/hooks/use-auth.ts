import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "candidate" | "recruiter" | "admin";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async (u: User | null) => {
      setUser(u);
      if (!u) {
        setRoles([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
      if (active) {
        setRoles((data ?? []).map((r) => r.role as AppRole));
        setLoading(false);
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => load(session?.user ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const primaryRole: AppRole | null = roles.includes("admin")
    ? "admin"
    : roles.includes("recruiter")
      ? "recruiter"
      : roles.includes("candidate")
        ? "candidate"
        : null;

  return { user, roles, primaryRole, loading };
}
