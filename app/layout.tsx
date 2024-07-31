import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin DashBoard",
  description: "Admin DashBoard For Practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="border-r border-slate-200">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-10">
              <Toaster />
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
