function LegalSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>

      {children}
    </section>
  );
}

export default LegalSection;
