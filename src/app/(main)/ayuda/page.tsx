"use client";

import { ArrowLeft, HelpCircle, MapPin, Navigation, Smartphone, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function HelpPage() {
  const router = useRouter();

  const features = [
    {
      icon: MapPin,
      title: 'Encuentra Estacionamiento',
      description: 'Visualiza en tiempo real la disponibilidad de espacios en todos los estacionamientos del campus CUCEI.',
      color: 'bg-blue-100 dark:bg-blue-950 text-[#1153a6]',
    },
    {
      icon: Navigation,
      title: 'Navegación Inteligente',
      description: 'Obtén rutas optimizadas y navegación paso a paso hacia el estacionamiento que elijas.',
      color: 'bg-green-100 dark:bg-green-950 text-green-600',
    },
    {
      icon: Smartphone,
      title: 'Recomendaciones',
      description: 'El sistema te sugiere las mejores opciones basadas en cercanía y disponibilidad actual.',
      color: 'bg-purple-100 dark:bg-purple-950 text-purple-600',
    },
    {
      icon: Clock,
      title: 'Actualización en Tiempo Real',
      description: 'La información se actualiza constantemente para mostrarte siempre datos precisos.',
      color: 'bg-orange-100 dark:bg-orange-950 text-orange-600',
    },
  ];

  const colorGuide = [
    {
      color: 'bg-green-500',
      title: 'Verde - Alta Disponibilidad',
      description: 'Más del 50% de espacios disponibles',
    },
    {
      color: 'bg-yellow-500',
      title: 'Amarillo - Ocupación Media',
      description: 'Entre 30% y 50% de espacios disponibles',
    },
    {
      color: 'bg-red-500',
      title: 'Rojo - Saturado',
      description: 'Menos del 30% de espacios disponibles',
    },
  ];

  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col">
        <div className="bg-[#1153a6] text-white px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6">
          <button
            onClick={() => router.push('/')}
            className="mb-4 flex items-center gap-2 text-white hover:text-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ayuda</h1>
              <p className="text-blue-100 text-sm">Cómo usar SmartMovility</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4">Características</h2>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4">Guía de Colores</h2>
            <div className="space-y-3">
              {colorGuide.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 ${item.color} rounded-full`} />
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4">Consejos</h2>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#1153a6] mt-0.5">•</span>
                  <span>Revisa la disponibilidad antes de salir de casa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1153a6] mt-0.5">•</span>
                  <span>Usa las recomendaciones del sistema para encontrar la mejor opción</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1153a6] mt-0.5">•</span>
                  <span>Actualiza el mapa para ver información en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1153a6] mt-0.5">•</span>
                  <span>Guarda tus estacionamientos favoritos para acceso rápido</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border mb-6">
            <h3 className="font-semibold mb-2">Acerca de SmartMovility</h3>
            <p className="text-sm text-muted-foreground mb-3">
              SmartMovility es una aplicación diseñada específicamente para estudiantes del CUCEI
              de la Universidad de Guadalajara, facilitando la búsqueda de estacionamiento en el campus.
            </p>
            <p className="text-xs text-muted-foreground">Versión 1.0.0 • © 2026 SmartMovility</p>
          </div>
        </div>
      </div>
    </div>
  );
}
