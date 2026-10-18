export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {children}
    </article>
  );
}
