"use client";

import { cn } from "@/lib/utils";

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
        "relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden",
        className
      )}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-yellow/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Decorative flower */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 animate-float">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="14" fill="#E8B931" />
              {[...Array(12)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="22"
                  rx="9"
                  ry="22"
                  fill="white"
                  opacity="0.95"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Event title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 tracking-wide">
          {eventTitle}
        </h1>

        {/* Event details */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center justify-center gap-2 text-foreground-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg md:text-xl">{eventDate}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-foreground-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-lg md:text-xl">{eventTime}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-foreground-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-lg md:text-xl">{eventLocation}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-accent-yellow" />
          <div className="h-px w-16 bg-foreground/20" />
        </div>

        {/* Hero message / gratitude text */}
        <div className="card p-6 md:p-8 max-w-2xl mx-auto">
          <p className="text-foreground-secondary text-base md:text-lg leading-relaxed italic">
            "{heroMessage}"
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 md:mt-16 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto text-foreground-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <p className="text-foreground-muted text-sm mt-2">
            Desliza para ver los regalos
          </p>
        </div>
      </div>
    </section>
  );
}
