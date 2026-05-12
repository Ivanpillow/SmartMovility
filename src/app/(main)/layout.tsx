import type { ReactNode } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh flex-col">
        <main className="relative flex-1 pb-[calc(78px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
