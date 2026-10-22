import FadeUp from "../animations/FadeUp";
import Button from "../shared/Button";

function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow && (
          <FadeUp>
            <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
              {eyebrow}
            </span>
          </FadeUp>
        )}

        <FadeUp delay={0.1}>
          <h1 className="text-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h1>
        </FadeUp>

        {description && (
          <FadeUp delay={0.2}>
            <p className="mt-1 text-xs">{description}</p>
          </FadeUp>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center gap-3">
          {secondaryAction && (
            <FadeUp delay={0.25}>
              <Button
                href={secondaryAction.href}
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || "outline"}
                size={secondaryAction.size || "xs"}
                leftIcon={secondaryAction.icon}
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled}
              >
                {secondaryAction.label}
              </Button>
            </FadeUp>
          )}

          {action && (
            <FadeUp delay={0.3}>
              <Button
                href={action.href}
                onClick={action.onClick}
                variant={action.variant || "admin"}
                size={action.size || "xs"}
                leftIcon={action.icon}
                loading={action.loading}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            </FadeUp>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;
