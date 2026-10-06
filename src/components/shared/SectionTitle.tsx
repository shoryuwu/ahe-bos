import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  highlight,
  subtitle,
  center = false,
  className,
}: SectionTitleProps) {
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className={cn("mb-14 md:mb-16 lg:mb-20", center && "text-center", className)}>
      {badge && (
        <div className={cn("mb-3", center && "flex justify-center")}>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--ahe-purple-light)] text-[var(--ahe-purple)]">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {titleParts[0]}
        {highlight && (
          <span className="text-gradient">{highlight}</span>
        )}
        {titleParts[1]}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl",
          center && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
