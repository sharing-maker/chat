export const metadata = {
  title: "Droppii Chat Login",
  description: "Next.js login page",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen flex flex-col" suppressHydrationWarning>
        <header className="shadow-md border-b text-center p-4 flex-shrink-0">
          <img
            src="/droppii.svg"
            alt="Logo"
            width="200"
            height="200"
            className="mx-auto"
            style={{ width: "200px", height: "auto", maxHeight: "200px" }}
          />
        </header>

        <div className="flex flex-1 w-full">
          <main className="flex-1 p-6 bg-white flex mt-40 justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
