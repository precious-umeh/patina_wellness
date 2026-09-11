import { cn } from "@/app/lib/utils";

const baseStyles =
  "animate-spin rounded-full border-current border-t-transparent shrink-0";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

function Spinner({ size = "md", className, ...props }) {
  const classes = cn(baseStyles, sizes[size] ?? sizes.md, className);

  return <span aria-hidden="true" className={classes} {...props} />;
}

export default Spinner;
