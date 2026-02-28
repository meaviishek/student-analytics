import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Talentify Assessment Platform",
  description: "Domain-specific career assessment and readiness platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl transition-all shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
                T
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Talentify</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
              <a href="/#about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="/#benefits" className="hover:text-blue-600 transition-colors">Benefits</a>
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Register Now &rarr;</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col relative">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-500">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-slate-900">Talentify</span>
            </div>
            <p className="text-sm">© 2026 Talentify. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
