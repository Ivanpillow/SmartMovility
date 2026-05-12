"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, List, Star } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/mapa', icon: Map, label: 'Mapa' },
    { path: '/opciones', icon: List, label: 'Opciones' },
    { path: '/recomendaciones', icon: Star, label: 'Mejores' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[78px] bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-border px-4 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-col items-center gap-1 transition-colors ${
                active ? 'text-[#1153a6]' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'fill-[#1153a6]/10' : ''}`} />
              <span className="text-[11px] leading-none font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
