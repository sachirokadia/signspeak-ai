import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-4 text-3xl leading-[1.1] font-semibold text-balance sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">{description}</p>
      ) : null}
    </Reveal>
  );
}
