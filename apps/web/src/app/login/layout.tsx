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
    <body className="flex flex-col" suppressHydrationWarning>
      <div className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100 relative">
          <img
            src="/background-login.jpg"
            alt="logo"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        <div className="flex w-full md:w-1/3 items-center justify-center">
          {children}
        </div>
      </div>
    </body>
  );
}
