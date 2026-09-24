import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, Menu, X, Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram, Bell, User, LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4";

type NavItem = { label: string; to: "/dashboard" | "/recruiter" | "/candidate" | "/" ; hash?: string };
const NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Sessions", to: "/recruiter" },
  { label: "Candidates", to: "/recruiter" },
  { label: "Assessments", to: "/candidate" },
  { label: "Results", to: "/recruiter" },
];

const FOOTER = [
  { title: "PLATFORM", links: ["Dashboard", "Sessions", "Candidates", "Assessments", "Results"] },
  { title: "VERIFICATION", links: ["Resume Intelligence", "Role Matching", "Live Assessments", "Skill Evidence", "Skill Passport"] },
  { title: "RESOURCES", links: ["How It Works", "Documentation", "Assessment Guide", "Candidate Guide", "Recruiter Guide", "FAQs"] },
  { title: "COMPANY", links: ["About SkillVerify", "Contact", "Privacy", "Terms", "Security", "Careers"] },
];
const SOCIAL = [Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 480 480" className="w-8 h-8" fill="white" aria-hidden>
        <path d="M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240Z" />
        <path d="M240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0Z" />
        <path d="M480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240Z" />
        <path d="M240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z" />
      </svg>
      <span className="text-white text-xl font-bold tracking-wider">SKILLVERIFY</span>
    </Link>
  );
}

export function GradientButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileMenuOpen) {
      const id = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 500);
  };
  const toggle = () => (mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true));

  const stagger = (i: number) => ({
    transition: "opacity 400ms ease-out, transform 400ms ease-out",
    transitionDelay: menuVisible ? `${350 + i * 50}ms` : "0ms",
    opacity: menuVisible ? 1 : 0,
    transform: menuVisible ? "translateY(0)" : "translateY(12px)",
  });

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const startSession = () => navigate({ to: user ? "/sessions/new" : "/auth" });

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden bg-black"
      style={{ fontFamily: '"Helvetica Now Var", Helvetica, Arial, sans-serif' }}
    >
      <video autoPlay muted loop playsInline src={VIDEO} className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="relative flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
          <Logo />
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((l) => (
              <Link key={l.label} to={l.to} className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-5">
            {user ? (
              <>
                <button aria-label="Notifications" className="text-white/70 hover:text-white transition-colors"><Bell className="w-4 h-4" /></button>
                <Link to="/dashboard" aria-label="Profile" className="text-white/70 hover:text-white transition-colors"><User className="w-4 h-4" /></Link>
                <button onClick={logout} aria-label="Log out" className="text-white/70 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
              </>
            ) : (
              <Link to="/auth" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200">LOG IN</Link>
            )}
            <GradientButton onClick={startSession}>
              START SESSION <ArrowRight className="w-4 h-4" />
            </GradientButton>
          </div>
          <button onClick={toggle} aria-label="Toggle menu" className="lg:hidden relative z-[60] w-8 h-8 text-white">
            <Menu className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
            <X className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
          </button>

          {mobileMenuOpen && (
            <>
              <div
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md lg:hidden"
                style={{ transition: "opacity 400ms", opacity: menuVisible ? 1 : 0 }}
              />
              <div className="absolute left-0 right-0 top-[68px] z-50 lg:hidden">
                <div className="absolute inset-0 backdrop-blur-xl rounded-b-2xl" />
                <div className="relative z-10 flex flex-col items-center gap-6 py-10">
                  {NAV.map((l, i) => (
                    <Link key={l.label} to={l.to} onClick={closeMenu} style={stagger(i)}
                      className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  ))}
                  {user ? (
                    <button onClick={() => { closeMenu(); logout(); }} style={stagger(NAV.length)}
                      className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white">Log out</button>
                  ) : (
                    <Link to="/auth" onClick={closeMenu} style={stagger(NAV.length)}
                      className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white">Log in</Link>
                  )}
                  <div style={stagger(NAV.length + 1)}>
                    <GradientButton onClick={() => { closeMenu(); startSession(); }}>
                      START SESSION <ArrowRight className="w-4 h-4" />
                    </GradientButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-10 sm:pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
            {FOOTER.map((c) => (
              <div key={c.title}>
                <h3 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">{c.title}</h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-white/50 hover:text-white/80 text-[10px] sm:text-xs transition-colors duration-200">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-2">
              <h3 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">GET SKILLVERIFY UPDATES</h3>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input type="email" placeholder="Type your email to sign up"
                  className="flex-1 min-w-0 bg-white text-black text-[10px] sm:text-xs px-3 py-2.5 rounded-l-md outline-none" />
                <button type="submit" className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-[10px] sm:text-xs font-bold tracking-wider px-4 rounded-r-md">SEND IT</button>
              </form>
              <h3 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mt-5 sm:mt-6 mb-3">CONNECT</h3>
              <div className="flex gap-3">
                {SOCIAL.map((Icon, i) => (
                  <a key={i} href="#" className="text-white/50 hover:text-white transition-colors duration-200"><Icon className="w-4 h-4" /></a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`liquid-glass rounded-2xl p-6 text-white ${className}`}>{children}</div>;
}

export const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70 transition-colors";
