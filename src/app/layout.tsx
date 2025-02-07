"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const excludedPaths = ["/api/auth/signin"];

  const shouldExcludeLayout = excludedPaths.includes(pathname);

  return (
    <html lang="en">
      <SessionProvider>
        <body className={inter.className}>
          {!shouldExcludeLayout ? (
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} /> {/* Passing totalEarnings */}
              <div className="flex flex-1">
                <Sidebar open={sidebarOpen} />
                <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <>{children}</>
          )}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
