export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-[60vh] w-full justify-center">{children}</main>
  );
}
