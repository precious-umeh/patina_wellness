function ModalDetailRow({ label, value }) {
  return (
    <div className="item-start flex justify-between gap-6 px-4 py-3">
      <span className="text-muted shrink-0 text-[11px] font-medium">
        {label}
      </span>

      <span className="text-heading text-right text-xs font-semibold">
        {value || ""}
      </span>
    </div>
  );
}

export default ModalDetailRow;
