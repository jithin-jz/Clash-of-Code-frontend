import React from "react";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Marketplace", href: "/store" },
  { label: "Buy XP", href: "/buy-xp" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { label: "Twitter", href: "https://x.com", Icon: Twitter },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-xl border border-white/10 bg-[#0d172a]/85 backdrop-blur-md px-5 py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr_1.1fr]">
        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-slate-400">
            Clash Of Code
          </p>
          <p className="mt-3 max-w-md text-sm text-slate-400 leading-relaxed">
            A structured coding platform for building consistency, mastering
            fundamentals, and shipping better code through deliberate practice.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-500">
            Quick Links
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-500">
            Connect
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] inline-flex items-center justify-center transition-all"
              >
                {React.createElement(item.Icon, { size: 16 })}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">© {year} Clash Of Code. All rights reserved.</p>
        <p className="text-[11px] text-slate-600">
          Built for focused coding practice.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
