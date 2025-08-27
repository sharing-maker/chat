"use client";

import RootLayout from "@web/app/layout";
import LoginPage from "@web/app/login/page";

export default function App() {
  console.log("export default function App");
  return (
    <RootLayout>
      <LoginPage />
    </RootLayout>
  );
}
