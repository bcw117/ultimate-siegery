export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="py-28">{children}</main>;
}
