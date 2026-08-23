import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="SignSpeak AI home"
    >
      <span className="bg-brand relative grid h-9 w-9 place-items-center rounded-xl shadow-soft transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M10 10.5V4.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M13 10.5V6a1.5 1.5 0 0 1 3 0v6" />
          <path d="M16 12V9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a5 5 0 0 1-4.3-2.4L4 13.5a1.6 1.6 0 0 1 2.7-1.7L8 13.5" />
        </svg>
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">
        SignSpeak<span className="text-gradient"> AI</span>
      </span>
    </Link>
  );
}
