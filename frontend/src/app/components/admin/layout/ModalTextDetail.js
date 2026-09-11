function ModalTextDetail({ label, value, emptyText = "Not provided." }) {
  return (
    <div>
      <p className="text-muted text-[10px] font-bold tracking-wide uppercase">
        {label}
      </p>

      <div className="border-border bg-background mt-2 rounded-lg border p-3">
        <p className="text-heading text-xs leading-relaxed wrap-break-word whitespace-pre-wrap">
          {value || <span className="text-muted italic">{emptyText}</span>}
        </p>
      </div>
    </div>
  );
}

export default ModalTextDetail;
