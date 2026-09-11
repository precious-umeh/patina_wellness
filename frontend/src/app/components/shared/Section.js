import { cn } from "@/app/lib/utils";

const spacing = {
  none: "",
  sm: "py-10 lg:py-14",
  md: "py-16 lg:py-24",
  lg: "py-20 lg:py-32",
};

function Section({
  children,
  className,
  as: Component = "section",
  size = "md",
}) {
  return (
    <Component className={cn(spacing[size] ?? spacing.md, className)}>
      {children}
    </Component>
  );
}

export default Section;
