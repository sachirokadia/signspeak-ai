import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      {eyebrow ? (
        <span className="text-eyebrow inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:mt-6">
        {title}
      </h2>
      {description ? (
        <p className="text-lead mt-4 text-muted-foreground text-pretty md:mt-6">{description}</p>
      ) : null}
    </Reveal>
  );
}
