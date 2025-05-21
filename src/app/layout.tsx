import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda - Mi Reyna Artesanías",
  description:
    "Tienda de artesanías y productos de calidad. Encuentra todo lo que necesitas para vos y regala productos únicos y originales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col h-screen w-full container mx-auto">
          <CartProvider>{children}</CartProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
