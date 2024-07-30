import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin DashBoard",
  description: "Admin DashBoard For Pratice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <div className="h-[100vh] border-r border-slate-200">
            <Sidebar />
          </div>
          <div className="w-full md: w-max-[1400px]">
            <Navbar />
            <div className="p-10">
              {children}
            </div>

          </div>
        </div>
      </body>
    </html>
  );
}
