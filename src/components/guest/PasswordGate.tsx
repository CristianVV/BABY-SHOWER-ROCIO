"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PasswordGateProps {
  validatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function PasswordGate({ validatePassword }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Por favor, introduce la contrasena");
      return;
    }

    startTransition(async () => {
      const result = await validatePassword(password);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Contrasena incorrecta");
        setPassword("");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="card p-8 md:p-10 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Baby Shower de Rocio
            </h1>
            <p className="text-foreground-secondary text-sm md:text-base">
              Introduce la contrasena para acceder a la lista de regalos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="label">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduce la contrasena"
                className={cn(
                  "input w-full",
                  error && "border-state-error focus-visible:ring-state-error"
                )}
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="text-sm text-state-error mt-1">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isPending}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-foreground-muted text-xs mt-6">
            La contrasena se encuentra en la invitacion
          </p>
        </div>

        {/* Decorative daisy element */}
        <div className="absolute -top-4 -right-4 w-12 h-12 opacity-50">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="12" fill="#E8B931" />
            {[...Array(8)].map((_, i) => (
              <ellipse
                key={i}
                cx="50"
                cy="25"
                rx="8"
                ry="20"
                fill="white"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
