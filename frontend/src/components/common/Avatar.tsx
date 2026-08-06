import { cn } from "@/lib/utils";

export function Avatar({
  name = "User",
  src,
  size = "md",
  className,
}: {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-brand font-semibold text-white",
        sizeClasses[size],
        className
      )}
      aria-label={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}
