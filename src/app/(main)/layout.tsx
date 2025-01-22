import Footer from "@/layouts/Footer";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
