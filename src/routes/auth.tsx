import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Shell, GlassCard, GradientButton, inputCls } from "@/components/Shell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log in or sign up — SkillVerify" },
      { name: "description", content: "Sign in to SkillVerify as a candidate or recruiter." },
      { property: "og:title", content: "Log in — SkillVerify" },
      { property: "og:description", content: "Sign in to SkillVerify as a candidate or recruiter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [accountType, setAccountType] = useState<"candidate" | "recruiter">("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) navigate({ to: "/dashboard", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name, account_type: accountType } },
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Check your email to confirm your account, then log in." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "If that email exists, a reset link is on its way." });
      }
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setMsg(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setMsg({ kind: "err", text: r.error.message ?? "Google sign-in failed" });
  };

  return (
    <Shell>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <GlassCard className="w-full max-w-md p-8 animate-scale-in">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h1>
          <p className="text-white/60 text-sm mb-6">Verify skills. Hire with evidence.</p>

          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(["candidate", "recruiter"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setAccountType(t)}
                  className={`rounded-lg py-3 text-xs tracking-[0.15em] uppercase border transition-all ${accountType === t ? "border-cyan-400 bg-cyan-400/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]" : "border-white/15 text-white/60 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && <input className={inputCls} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />}
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {mode !== "forgot" && (
              <input className={inputCls} type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            )}
            <GradientButton type="submit" disabled={busy} className="w-full py-3">
              {busy ? "Please wait…" : mode === "login" ? "LOG IN" : mode === "signup" ? "SIGN UP" : "SEND RESET LINK"}
            </GradientButton>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="flex items-center gap-3 my-5 text-white/40 text-xs"><span className="flex-1 h-px bg-white/15" />OR<span className="flex-1 h-px bg-white/15" /></div>
              <button onClick={google} className="liquid-glass w-full rounded-full py-3 text-sm tracking-wide">Continue with Google</button>
              {mode === "signup" && <p className="text-white/40 text-xs mt-2 text-center">Google sign-ups start as candidate accounts.</p>}
            </>
          )}

          {msg && <p className={`mt-4 text-sm ${msg.kind === "ok" ? "text-emerald-300" : "text-red-300"}`}>{msg.text}</p>}

          <div className="mt-6 flex justify-between text-xs text-white/60">
            {mode === "login" ? (
              <>
                <button onClick={() => setMode("signup")} className="hover:text-white">Create account</button>
                <button onClick={() => setMode("forgot")} className="hover:text-white">Forgot password?</button>
              </>
            ) : (
              <button onClick={() => setMode("login")} className="hover:text-white">Back to log in</button>
            )}
          </div>
        </GlassCard>
      </div>
    </Shell>
  );
}
