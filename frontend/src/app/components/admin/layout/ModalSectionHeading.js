function ModalSectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary-light text-primary-dark flex h-8 w-8 items-center justify-center rounded-lg">
        {icon}
      </span>

      <h3 className="text-heading text-sm font-extrabold">{title}</h3>
    </div>
  );
}

export default ModalSectionHeading;
