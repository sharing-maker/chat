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
      <body className="flex flex-col" suppressHydrationWarning>
        <div className="flex w-full min-h-screen bg-gray-50">
          <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100">
            <img
              src="/kururin-kuru-kuru.gif"
              alt="logo"
              className="w-56 h-56"
            />
          </div>
          <div className="flex w-full md:w-1/3 items-center justify-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
