import { cn } from "@/app/lib/utils";

const baseStyles =
  "border-border bg-surface space-y-3 rounded-xl border p-5 shadow-2xs";

const iconStyles =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg";

function AdminStatsCard({
  label,
  value,
  subtext,
  icon,
  iconClassName,
  subtextClassName,
  className,
}) {
  return (
    <div className={cn(baseStyles, className)}>
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted text-xs font-bold tracking-wide uppercase">
          {label}
        </span>

        {icon && <div className={cn(iconStyles, iconClassName)}>{icon}</div>}
      </div>

      {/* Card Value */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-heading text-2xl font-extrabold">{value}</p>

        {subtext && (
          <span className={cn("text-[11px] font-medium", subtextClassName)}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

export default AdminStatsCard;
