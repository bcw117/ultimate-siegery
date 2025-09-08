export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="mt-24 prose prose-slate dark:prose-invert max-w-none">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
