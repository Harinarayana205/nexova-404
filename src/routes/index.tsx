import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, Menu, X, Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "404 — Page Not Found | NEXOVA Hosting" },
      { name: "description", content: "This page slipped beyond our reach. Return to NEXOVA hosting: domains, servers, cloud and more." },
      { property: "og:title", content: "404 — Page Not Found | NEXOVA" },
      { property: "og:description", content: "This page slipped beyond our reach. Head back to NEXOVA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "https://db.onlinewebfonts.com/c/e66905e07608167a84e6ad52f638c3c6?family=Helvetica+Now+Var" },
    ],
  }),
  component: NotFoundPage,
});

const VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4";
const NAV = ["Domain", "Servers", "Cloud", "Managed", "Email", "Privacy"];
const FOOTER = [
  { title: "SERVERS", links: ["Web Servers", "VPS Servers", "Cloud Servers", "Managed Instances", "Bare Metal"] },
  { title: "DOMAINS", links: ["Find Domain", "Move Domains", "DNS Manager", "Domain Costs"] },
  { title: "HELP US", links: ["Open a Ticket", "FAQs", "Docs", "Tutorials", "Forum"] },
  { title: "ABOUT", links: ["Our Story", "Leadership Team", "Press Room", "We Hire", "Alliance", "Blog"] },
];
const SOCIAL = [Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram];

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 480 480" className="w-8 h-8" fill="white" aria-hidden>
        <path d="M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240Z" />
        <path d="M240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0Z" />
        <path d="M480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240Z" />
        <path d="M240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z" />
      </svg>
      <span className="text-white text-xl font-bold tracking-wider">NEXOVA</span>
    </a>
  );
}

function NotFoundPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      const id = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(id);
    }
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

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-black"
      style={{ fontFamily: '"Helvetica Now Var", Helvetica, Arial, sans-serif' }}>
      <video autoPlay muted loop playsInline src={VIDEO}
        className="absolute inset-0 w-full h-full object-cover" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="relative flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
          <Logo />
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((l) => (
              <a key={l} href="#" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200">{l}</a>
            ))}
          </div>
          <a href="#" className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full">
            LOG IN <ArrowRight className="w-4 h-4" />
          </a>
          <button onClick={toggle} aria-label="Toggle menu" className="lg:hidden relative z-[60] w-8 h-8 text-white">
            <Menu className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
            <X className={`absolute inset-0 w-8 h-8 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
          </button>

          {mobileMenuOpen && (
            <>
              <div onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md lg:hidden"
                style={{ transition: "opacity 400ms", opacity: menuVisible ? 1 : 0 }} />
              <div className="absolute left-0 right-0 top-[68px] z-50 lg:hidden">
                <div className="absolute inset-0 backdrop-blur-xl rounded-b-2xl" />
                <div className="relative z-10 flex flex-col items-center gap-6 py-10">
                  {NAV.map((l, i) => (
                    <a key={l} href="#" onClick={closeMenu} style={stagger(i)}
                      className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white">{l}</a>
                  ))}
                  <a href="#" style={stagger(NAV.length)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full">
                    LOG IN <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </>
          )}
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-0">
          <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-1 sm:mb-2">This page seems to have</h1>
          <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">slipped beyond our reach :/</h1>
          <div className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible">
            <span className="four-oh-four text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] lg:text-[260px] font-black text-white leading-none tracking-tighter select-none">404</span>
          </div>
          <a href="/" className="liquid-glass text-white text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase">
            Return to Main Page
          </a>
        </main>

        <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-10 sm:pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
            {FOOTER.map((c) => (
              <div key={c.title}>
                <h3 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">{c.title}</h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}><a href="#" className="text-white/50 hover:text-white/80 text-[10px] sm:text-xs transition-colors duration-200">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-2">
              <h3 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">JOIN FOR EXCLUSIVE DEALS</h3>
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
