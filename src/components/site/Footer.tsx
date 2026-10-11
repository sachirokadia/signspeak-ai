"use client";

import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle } from "@/components/ui/doodles";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/history", label: "History" },
      { to: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#171022] text-white">
      <Sparkle className="absolute right-8 top-8 h-8 w-8 text-yellow/60" aria-hidden="true" />
      <Sparkle className="absolute bottom-24 left-6 h-5 w-5 text-primary/70" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="text-white">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Real-time gesture recognition that turns hand signs into text and natural speech — built
            for non-verbal communication, on any device with a camera.
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-bold text-white">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} SignSpeak AI. Communication belongs to everyone.
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Trust highlights">
            <StickerChip tone="yellow" tilt="left">
              WCAG 2.2 AA
            </StickerChip>
            <StickerChip tone="violet" tilt="right">
              On-device inference
            </StickerChip>
            <StickerChip tone="yellow" tilt="left">
              Privacy first
            </StickerChip>
          </div>
        </div>
      </div>
    </footer>
  );
}
