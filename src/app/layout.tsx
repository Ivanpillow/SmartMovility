import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartMovility',
  description: 'Encuentra tu estacionamiento ideal en CUCEI',
  icons: {
    icon: '/LogoSmartMovility.svg',
    shortcut: '/LogoSmartMovility.svg',
    apple: '/LogoSmartMovility.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground">
        <div className="pointer-events-none fixed right-3 top-3 z-[60] rounded-lg bg-white/75 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-black/35">
          <Image
            src="/LogoSmartMovility.svg"
            alt="SmartMovility"
            width={125}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </div>
        {children}
      </body>
    </html>
  );
}
