import React from "react";
import Navbar from "./components/Navbar";
import ClientProvider from "./providers/ClientProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Type for the children prop
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <ClientProvider>
          <Navbar /> {/* Renders the navigation bar */}
          <main className="container mx-auto px-4 py-8">
            {children} {/* Renders child components/pages */}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
