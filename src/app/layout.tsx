import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CrispChat } from "@/components/chatbot/ChatCrisp";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SmartMovility",
  description: "Encuentra tu estacionamiento ideal en CUCEI",
  icons: {
    icon: "/LogoSmartMovility.svg",
    shortcut: "/LogoSmartMovility.svg",
    apple: "/LogoSmartMovility.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground">
        <CrispChat />
        <Toaster position="top-center" richColors closeButton />
        {children}
      </body>
    </html>
  );
}