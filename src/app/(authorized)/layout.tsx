export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 md:py-14">
      {children}
    </div>
  );
}
