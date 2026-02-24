import React from "react";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";

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
    <footer className="w-full border-t border-white/[0.06] bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            © {year} CLASH OF CODE
          </p>
          <div className="hidden sm:block h-3 w-[1px] bg-white/[0.1]"></div>
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="text-slate-500 hover:text-white transition-colors duration-200"
              >
                {React.createElement(item.Icon, { size: 14 })}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
