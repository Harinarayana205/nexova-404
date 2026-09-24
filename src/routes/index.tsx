import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileSearch, GitCompareArrows, Code2, ShieldCheck } from "lucide-react";
import { Shell, GradientButton, GlassCard } from "@/components/Shell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillVerify — Don't Just Read the Resume. Verify the Skill." },
      { name: "description", content: "AI-powered live skill verification for practical, evidence-based hiring." },
      { property: "og:title", content: "SkillVerify — Verify Skills. Hire With Evidence." },
      { property: "og:description", content: "AI-powered live skill verification for practical, evidence-based hiring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const CARDS = [
  { icon: FileSearch, title: "Resume Intelligence", body: "AI extracts skills, education, experience, projects, certifications and technical evidence." },
  { icon: GitCompareArrows, title: "Role Matching", body: "AI analyzes candidate evidence against job requirements and suggests relevant roles." },
  { icon: Code2, title: "Live Assessment", body: "Candidates demonstrate their actual skills through practical assessments." },
  { icon: ShieldCheck, title: "Verified Evidence", body: "Recruiters see practical performance evidence instead of relying only on resume claims." },
];
const FLOW = ["Resume", "AI Skill Extraction", "Role Matching", "Live Assessment", "Real Evaluation", "Verified Skills", "Recruiter Evidence"];

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Shell>
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24 min-h-[70vh]">
        <p className="text-white/60 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6">Don't just read the resume. Verify the skill.</p>
        <h1 className="four-oh-four text-white text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
          VERIFY SKILLS.<br />HIRE WITH EVIDENCE.
        </h1>
        <p className="text-white/80 text-base sm:text-lg md:text-xl font-light max-w-2xl mt-8 mb-10 leading-snug">
          SkillVerify transforms resumes into practical skill verification through AI-powered role matching and live assessments.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <GradientButton onClick={() => navigate({ to: user ? "/sessions/new" : "/auth" })}>
            START SESSION <ArrowRight className="w-4 h-4" />
          </GradientButton>
          <a href="#how" className="liquid-glass text-white text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase">
            How It Works
          </a>
        </div>
      </section>

      <section id="how" className="px-4 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CARDS.map(({ icon: Icon, title, body }, i) => (
            <GlassCard key={title} className="animate-fade-in transition-transform duration-300 hover:-translate-y-1" >
              <div style={{ animationDelay: `${i * 80}ms` }}>
                <Icon className="w-6 h-6 text-cyan-300 mb-4" />
                <h3 className="text-lg font-bold tracking-tight mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{body}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.15em] uppercase">
          {FLOW.map((s, i) => (
            <span key={s} className="flex items-center gap-2 sm:gap-3">
              <span className="liquid-glass rounded-full px-4 py-2 text-white/80">{s}</span>
              {i < FLOW.length - 1 && <ArrowRight className="w-3 h-3 text-emerald-300" />}
            </span>
          ))}
        </div>
        {!user && (
          <p className="text-center text-white/50 text-sm mt-10">
            Already have an account? <Link to="/auth" className="text-cyan-300 hover:text-white">Log in</Link>
          </p>
        )}
      </section>
    </Shell>
  );
}
