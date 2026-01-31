"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroSectionProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  heroMessage: string;
  className?: string;
}

export default function HeroSection({
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  heroMessage,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative py-20 md:py-32 px-4 overflow-hidden bg-background",
        className
      )}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/30 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-container/30 rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* Main Header Image - Animated */}
        <div className="relative w-full h-[50vh] md:h-[70vh] mb-8 animate-float">
          <Image
            src="/daisies_main.png"
            alt={eventTitle}
            fill
            className="object-contain drop-shadow-sm"
            priority
          />
        </div>

        {/* Event capsule details */}
        <div className="inline-flex flex-wrap justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 px-5 py-3 rounded-pill bg-surface-container shadow-elevation-1 border border-outline/10 text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-lg">{eventDate}</span>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 rounded-pill bg-surface-container shadow-elevation-1 border border-outline/10 text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-lg">{eventTime}</span>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 rounded-pill bg-surface-container shadow-elevation-1 border border-outline/10 text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-lg">{eventLocation}</span>
          </div>
        </div>

        {/* Hero message card */}
        <div className="bg-surface/60 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-elevation-2 max-w-3xl border border-white/50">
          <p className="text-secondary text-lg md:text-xl leading-relaxed font-serif italic text-balance">
            "{heroMessage}"
          </p>
        </div>

        {/* FAB-style Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <div className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-12 h-16 rounded-full border-2 border-outline/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-outline/50 rounded-full animate-slide-up" />
            </div>
            <span className="text-sm font-medium text-secondary tracking-widest uppercase text-[10px]">Desliza</span>
          </div>
        </div>
      </div>
    </section>
  );
}
