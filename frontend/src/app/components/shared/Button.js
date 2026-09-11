// "use client";

// import Link from "next/link";
// import { cn } from "@/app/lib/utils";
// import Spinner from "./Spinner";

// const baseStyles =
//   "inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

// const variants = {
//   primary:
//     "bg-primary text-heading hover:bg-primary-hover shadow-md hover:shadow-lg hover:text-primary-light",
//   secondary:
//     "bg-background/70 text-heading border border-border backdrop-blur-sm hover:bg-primary-light",
//   outline:
//     "border-2 border-primary-dark text-primary-dark hover:bg-primary-light",
//   admin:
//     "bg-primary text-heading hover:bg-primary shadow-2xs hover:bg-primary-dark hover:text-white font-bold",
//   danger: "bg-danger/85 text-white shadow-2xs hover:bg-danger",
// };

// const sizes = {
//   xs: "px-4 py-2.5 text-xs",
//   sm: "h-10 px-5 text-sm",
//   md: "h-12 px-6 text-base",
//   lg: "h-14 px-8 text-base",
// };

// function Button({
//   children,
//   href,
//   onClick,
//   variant = "primary",
//   size = "md",
//   type = "button",
//   disabled = false,
//   loading = false,
//   fullWidth = false,
//   leftIcon,
//   rightIcon,
//   className,
//   ...props
// }) {
//   const classes = cn(
//     baseStyles,
//     variants[variant] ?? variants.primary,
//     sizes[size] ?? sizes.md,
//     fullWidth && "w-full",
//     className,
//   );

//   const isDisabled = disabled || loading;

//   const content = (
//     <>
//       {loading ? (
//         <Spinner size="sm" />
//       ) : (
//         leftIcon && (
//           <span className="inline-flex shrink-0 items-center justify-center">
//             {leftIcon}
//           </span>
//         )
//       )}

//       <span>{children}</span>

//       {!loading && rightIcon && (
//         <span className="inline-flex shrink-0 items-center justify-center">
//           {rightIcon}
//         </span>
//       )}
//     </>
//   );

//   if (href) {
//     return (
//       <Link
//         href={isDisabled ? "#" : href}
//         className={classes}
//         aria-disabled={isDisabled}
//         onClick={(e) => {
//           if (isDisabled) {
//             e.preventDefault();
//             return;
//           }

//           onClick?.(e);
//         }}
//         {...props}
//       >
//         {content}
//       </Link>
//     );
//   }

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={isDisabled}
//       className={classes}
//       {...props}
//     >
//       {content}
//     </button>
//   );
// }

// export default Button;

"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import Spinner from "./Spinner";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-1";

const variants = {
  primary:
    "bg-primary text-heading hover:bg-primary-hover shadow-md hover:shadow-lg hover:text-primary-light",
  secondary:
    "bg-background/70 text-heading border border-border backdrop-blur-sm hover:bg-primary-light",
  outline:
    "border-2 border-primary-dark text-primary-dark hover:bg-primary-light",
  admin:
    "bg-primary text-heading hover:bg-primary shadow-2xs hover:bg-primary-dark hover:text-white font-bold",
  danger: "bg-danger/85 text-white shadow-2xs hover:bg-danger",
};

const sizes = {
  xs: "px-4 py-2 text-xs",
  xxs: "min-h-8 px-5 text-[10px]",
  sm: "min-h-10 px-5 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-base",
};

function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) {
  const classes = cn(
    baseStyles,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    fullWidth && "w-full",
    className,
  );

  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        )
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={isDisabled ? "#" : href}
        className={classes}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }

          onClick?.(e);
        }}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
