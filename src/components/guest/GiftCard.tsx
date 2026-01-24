"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
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
  className?: string;
}

export default function GiftCard({
  gift,
  currency,
  onAddToCart,
  className,
}: GiftCardProps) {
  const [contributionAmount, setContributionAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);

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
      window.open(gift.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleMarkAsPurchased = () => {
    setIsPurchased(true);
    // For external gifts, we add to cart with 0 amount to track the purchase intent
    onAddToCart(gift.id, 0, "Comprado externamente");
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-state-success/10 text-state-success text-xs font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Completado
        </span>
      );
    }

    if (gift.status === "partially_funded") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow text-xs font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
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
        "card card-hover overflow-hidden flex flex-col",
        isCompleted && "opacity-75",
        className
      )}
    >
      {/* Image */}
      {gift.imageUrl && (
        <div className="relative aspect-[4/3] bg-background-light overflow-hidden">
          <Image
            src={gift.imageUrl}
            alt={gift.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {isCompleted && (
            <div className="absolute inset-0 bg-background-white/60 flex items-center justify-center">
              <div className="bg-state-success text-white px-4 py-2 rounded-full text-sm font-medium">
                Regalo completado
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-lg text-foreground font-medium leading-tight">
            {gift.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Description */}
        {gift.description && (
          <p className="text-foreground-secondary text-sm mb-4 line-clamp-2">
            {gift.description}
          </p>
        )}

        {/* Fundable gift content */}
        {isFundable && gift.targetAmount && (
          <div className="space-y-4 mt-auto">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground-secondary">
                  {formatCurrency(gift.currentAmount, currency)} de{" "}
                  {formatCurrency(gift.targetAmount, currency)}
                </span>
              </div>
              <ProgressBar value={progress} showLabel={false} size="md" />
            </div>

            {/* Contribution input */}
            {!isCompleted && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                      {currency === "EUR" ? "€" : "$"}
                    </span>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      placeholder={`Min. ${minContributionDisplay}`}
                      min={minContributionDisplay}
                      step="1"
                      className="input pl-8 w-full"
                    />
                  </div>
                  <Button
                    onClick={handleContribute}
                    disabled={
                      !contributionAmount ||
                      parseFloat(contributionAmount) * 100 < minContribution
                    }
                    variant="primary"
                    size="md"
                  >
                    Aportar
                  </Button>
                </div>
                <p className="text-xs text-foreground-muted">
                  Quedan {formatCurrency(remainingAmount, currency)} por financiar
                </p>
              </div>
            )}
          </div>
        )}

        {/* External gift content */}
        {isExternal && (
          <div className="space-y-3 mt-auto">
            {!isPurchased ? (
              <>
                <Button
                  onClick={handleExternalPurchase}
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={isCompleted}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Ver en tienda
                </Button>
                {!isCompleted && (
                  <button
                    onClick={handleMarkAsPurchased}
                    className="w-full text-sm text-foreground-secondary hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Ya lo compre
                  </button>
                )}
              </>
            ) : (
              <div className="p-3 rounded-xl bg-state-success/10 text-state-success text-sm text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mx-auto mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Marcado como comprado
              </div>
            )}
          </div>
        )}

        {/* Custom contribution content */}
        {isCustom && (
          <div className="space-y-3 mt-auto">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
                {currency === "EUR" ? "€" : "$"}
              </span>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Cantidad libre"
                min={minContributionDisplay}
                step="1"
                className="input pl-8 w-full"
              />
            </div>

            {/* Optional message toggle */}
            <button
              onClick={() => setShowMessageInput(!showMessageInput)}
              className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "h-4 w-4 transition-transform",
                  showMessageInput && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Anadir mensaje para el bebe
            </button>

            {showMessageInput && (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aqui..."
                rows={3}
                className="input w-full resize-none"
              />
            )}

            <Button
              onClick={handleContribute}
              disabled={
                !contributionAmount ||
                parseFloat(contributionAmount) * 100 < minContribution
              }
              variant="primary"
              size="md"
              className="w-full"
            >
              Contribuir
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
