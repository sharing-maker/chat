import Image from "next/image";

export const metadata = {
  title: "Droppii Chat Login",
  description: "Next.js admin layout with right sidebar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <header className="shadow-md border-b text-center p-4">
          <Image
            src="/droppii.svg"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto"
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
