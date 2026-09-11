import { cn } from "@/app/lib/utils";
import Reveal from "../animations/Reveal";

const baseStyles = "flex flex-col max-w-3xl";

const alignments = {
  responsive:
    "items-center text-center hero-desktop:items-start hero-desktop:text-left",
  left: "items-start text-left",
  center: "items-center text-center",
};

const sizes = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-4xl lg:text-5xl",
  lg: "text-4xl sm:text-5xl lg: text-6xl",
};

function SectionTitle({
  children,
  eyebrow,
  as: Component = "h2",
  align = "responsive",
  size = "md",
  className = "",
  headingClassName = "",
}) {
  const wrapperClasses = cn(
    baseStyles,
    alignments[align] ?? alignments.left,
    className,
  );

  const headingClasses = cn(
    "text-heading font-extrabold tracking-tight",
    sizes[size] ?? sizes.md,
    headingClassName,
  );

  return (
    <Reveal>
      <div className={wrapperClasses}>
        {eyebrow && (
          <span className="bg-primary-light text-primary-dark mb-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}

        <Component className={headingClasses}>{children}</Component>
      </div>
    </Reveal>
  );
}

export default SectionTitle;
