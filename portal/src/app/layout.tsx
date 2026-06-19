import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Property Portal",
  description: "Property Value Estimator and Market Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
        <header className="bg-white border-b sticky top-0 z-10 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-indigo-600">PropertyPortal</span>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link href="/estimator" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Estimator
                  </Link>
                  <Link href="/market" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Market
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav fallback */}
        <header className="bg-white border-b sm:hidden p-4">
            <span className="text-xl font-bold text-indigo-600 block mb-2">PropertyPortal</span>
            <div className="flex space-x-4">
                  <Link href="/estimator" className="text-sm font-medium text-indigo-600 underline">Estimator</Link>
                  <Link href="/market" className="text-sm font-medium text-indigo-600 underline">Market</Link>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
