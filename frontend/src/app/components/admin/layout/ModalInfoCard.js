function ModalInfoCard({ icon, label, value, href }) {
  const content = (
    <>
      <span className="bg-primary-light text-primary-dark flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-muted text-[10px] font-semibold">{label}</p>

        <p className="text-heading mt-0.5 truncate text-xs font-bold">
          {value || "-"}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="border-border bg-surface hover:border-primary-dark/30 flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="border-border bg-surface flex min-w-0 items-center gap-3 rounded-xl border p-3">
      {content}
    </div>
  );
}

export default ModalInfoCard;
