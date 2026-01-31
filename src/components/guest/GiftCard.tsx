"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import CurrencySelector from "./CurrencySelector";
import ExternalPurchaseModal from "./ExternalPurchaseModal";
import {
  cn,
  formatCurrency,
  calculateProgress,
  MIN_CONTRIBUTION_EUR,
  MIN_CONTRIBUTION_COP,
} from "@/lib/utils";
import type { Gift, GiftStatus, GiftType } from "@/types";

interface GiftCardProps {
  gift: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    externalUrl?: string | null;
    type: GiftType | string;
    targetAmount?: number | null;
    currentAmount: number;
    status: GiftStatus | string;
  };
  currency: "EUR" | "COP";
  onAddToCart: (giftId: string, amount: number, message?: string) => void;
  onCurrencyChange?: (currency: "EUR" | "COP") => void;
  className?: string;
}

export default function GiftCard({
  gift,
  currency,
  onAddToCart,
  onCurrencyChange,
  className,
}: GiftCardProps) {
  const [contributionAmount, setContributionAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);

  const minContribution =
    currency === "EUR" ? MIN_CONTRIBUTION_EUR : MIN_CONTRIBUTION_COP;
  const minContributionDisplay = minContribution / 100;

  const isCompleted = gift.status === "completed";
  const isFundable = gift.type === "fundable";
  const isExternal = gift.type === "external";
  const isCustom = gift.type === "custom";

  const progress = isFundable && gift.targetAmount
    ? calculateProgress(gift.currentAmount, gift.targetAmount)
    : 0;

  const remainingAmount = isFundable && gift.targetAmount
    ? Math.max(gift.targetAmount - gift.currentAmount, 0)
    : 0;

  const handleContribute = () => {
    const amountInCents = Math.round(parseFloat(contributionAmount) * 100);
    if (amountInCents >= minContribution) {
      onAddToCart(gift.id, amountInCents, message || undefined);
      setContributionAmount("");
      setMessage("");
      setShowMessageInput(false);
    }
  };

  const handleExternalPurchase = () => {
    if (gift.externalUrl) {
      const confirmed = window.confirm(
        "¡Recuerda volver aquí a marcar el regalo como que \"Ya lo has comprado\" si lo compras en Amazon o a través de otro enlace! ¡Muchas gracias!"
      );
      if (confirmed) {
        window.open(gift.externalUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleMarkAsPurchased = () => {
    setShowExternalModal(true);
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-state-success/10 text-state-success text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completado
        </span>
      );
    }

    if (gift.status === "partially_funded") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          En progreso
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent-green/10 text-accent-green text-xs font-medium">
        Disponible
      </span>
    );
  };

  return (
    <article
      className={cn(
        "bg-surface-container rounded-3xl overflow-hidden shadow-elevation-1 border border-outline/5 hover:shadow-elevation-2 transition-all duration-300 flex flex-col group",
        isCompleted && "opacity-75 grayscale-[0.5]",
        className
      )}
    >
      {gift.imageUrl && (
        <div className="relative aspect-square bg-surface-variant overflow-hidden">
          <Image src={gift.imageUrl} alt={gift.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          {isCompleted && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
              <div className="bg-state-success text-white px-4 py-2 rounded-pill text-sm font-medium shadow-elevation-1">Regalo completado</div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl text-primary font-semibold leading-tight">{gift.title}</h3>
          {isCustom && onCurrencyChange ? (
            <CurrencySelector value={currency} onChange={onCurrencyChange} className="scale-90 origin-top-right" />
          ) : (
            getStatusBadge()
          )}
        </div>

        {gift.description && (
          <p className="text-secondary text-sm mb-5 leading-relaxed">{gift.description}</p>
        )}

        {isFundable && gift.targetAmount && (
          <div className="space-y-5 mt-auto bg-surface p-4 rounded-2xl border border-outline/5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary font-medium">{formatCurrency(gift.currentAmount, currency)}</span>
                <span className="text-secondary/60 text-xs mt-0.5">de {formatCurrency(gift.targetAmount, currency)}</span>
              </div>
              <ProgressBar value={progress} showLabel={false} size="md" className="h-3 rounded-full bg-surface-variant [&>div]:bg-primary" />
            </div>

            {!isCompleted && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1 group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-medium text-sm transition-colors group-focus-within/input:text-primary">{currency === "EUR" ? "€" : "$"}</span>
                    <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder={`Min. ${minContributionDisplay}`} min={minContributionDisplay} step="1" className="w-full bg-surface-variant border-none rounded-2xl py-3 pl-9 pr-4 text-sm font-medium text-primary placeholder:text-secondary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>
                  <Button onClick={handleContribute} disabled={!contributionAmount || parseFloat(contributionAmount) * 100 < minContribution} variant="primary" size="md" className="rounded-xl px-4 bg-primary text-on-primary hover:bg-primary/90 shadow-none hover:shadow-elevation-1">Aportar</Button>
                </div>
                <p className="text-xs text-secondary/70 text-center">Faltan {formatCurrency(remainingAmount, currency)}</p>
              </div>
            )}
          </div>
        )}

        {isExternal && (
          <div className="space-y-3 mt-auto pt-2">
            {!isPurchased ? (
              <>
                <Button onClick={handleExternalPurchase} variant="primary" size="md" className="w-full rounded-pill bg-primary text-on-primary hover:bg-primary/90 hover:shadow-elevation-2 transition-all" disabled={isCompleted}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver en tienda
                </Button>
                {!isCompleted && (
                  <button onClick={handleMarkAsPurchased} className="w-full py-2 text-sm text-secondary hover:text-primary font-medium transition-colors">Ya lo compré</button>
                )}
              </>
            ) : (
              <div className="p-4 rounded-2xl bg-state-success/10 text-state-success text-sm text-center font-medium border border-state-success/20">
                <div className="w-8 h-8 rounded-full bg-state-success text-white flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Marcado como comprado
              </div>
            )}
          </div>
        )}

        {isCustom && (
          <div className="space-y-4 mt-auto bg-surface p-4 rounded-2xl border border-outline/5">
            <div className="relative group/input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-medium text-sm">{currency === "EUR" ? "€" : "$"}</span>
              <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="Cantidad libre" min={minContributionDisplay} step="1" className="w-full bg-surface-variant border-none rounded-2xl py-3 pl-9 pr-4 text-sm font-medium text-primary placeholder:text-secondary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
            </div>

            <button onClick={() => setShowMessageInput(!showMessageInput)} className="text-sm text-secondary hover:text-primary flex items-center gap-2 transition-colors font-medium w-full">
              <div className={cn("w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center transition-transform duration-300", showMessageInput && "rotate-180 bg-primary/10 text-primary")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {showMessageInput ? "Ocultar mensaje" : "Añadir mensaje para el bebé"}
            </button>

            {showMessageInput && (
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe tu mensaje aquí..." rows={3} className="w-full bg-surface-variant border-none rounded-2xl p-4 text-sm text-primary placeholder:text-secondary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none animate-slide-up" />
            )}

            <Button onClick={handleContribute} disabled={!contributionAmount || parseFloat(contributionAmount) * 100 < minContribution} variant="primary" size="md" className="w-full rounded-xl bg-primary text-on-primary hover:bg-primary/90 shadow-none hover:shadow-elevation-1">Contribuir</Button>
          </div>
        )}
      </div>

      <ExternalPurchaseModal isOpen={showExternalModal} onClose={() => setShowExternalModal(false)} giftId={gift.id} giftTitle={gift.title} />
    </article>
  );
}
