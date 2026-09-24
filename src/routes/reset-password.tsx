import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shell, GlassCard, GradientButton, inputCls } from "@/components/Shell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — SkillVerify" },
      { name: "description", content: "Choose a new password for your SkillVerify account." },
      { property: "og:title", content: "Reset password — SkillVerify" },
      { property: "og:description", content: "Choose a new password for your SkillVerify account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setErr(error.message);
    else navigate({ to: "/dashboard" });
  };
  return (
    <Shell>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <GlassCard className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6">Set a new password</h1>
          <form onSubmit={submit} className="space-y-3">
            <input className={inputCls} type="password" minLength={6} placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} required />
            <GradientButton type="submit" disabled={busy} className="w-full py-3">{busy ? "Saving…" : "SAVE PASSWORD"}</GradientButton>
          </form>
          {err && <p className="mt-4 text-sm text-red-300">{err}</p>}
        </GlassCard>
      </div>
    </Shell>
  );
}
