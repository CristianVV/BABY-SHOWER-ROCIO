"use client";

import { useState } from "react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Contribution, Gift, ContributionStatus } from "@/types";

interface ContributionWithGift extends Contribution {
  gift: Gift;
}

interface ContributionCardProps {
  contribution: ContributionWithGift;
  onVerify?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  showActions?: boolean;
}

const statusLabels: Record<ContributionStatus, string> = {
  pending: "Pendiente",
  verified: "Verificado",
  rejected: "Rechazado",
};

const statusStyles: Record<ContributionStatus, string> = {
  pending: "bg-state-pending/10 text-foreground border-state-pending/30",
  verified: "bg-state-success/10 text-state-success border-state-success/30",
  rejected: "bg-state-error/10 text-state-error border-state-error/30",
};

const paymentMethodLabels: Record<string, string> = {
  bizum: "Bizum",
  revolut: "Revolut",
  bancolombia: "Bancolombia",
};

export default function ContributionCard({
  contribution,
  onVerify,
  onReject,
  showActions = true,
}: ContributionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!onVerify) return;
    setLoading(true);
    try {
      await onVerify(contribution.id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    if (!confirm("¿Estas segura de que quieres rechazar esta contribucion?")) {
      return;
    }
    setLoading(true);
    try {
      await onReject(contribution.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-background-white rounded-2xl border p-6 transition-opacity",
        statusStyles[contribution.status as ContributionStatus],
        loading && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-foreground">
                {contribution.guestName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {contribution.guestName}
              </p>
              <p className="text-sm text-foreground-muted">{contribution.guestPhone}</p>
            </div>
          </div>

          {/* Gift info */}
          <div className="bg-background-light/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-foreground-secondary mb-1">Regalo:</p>
            <p className="font-medium text-foreground">{contribution.gift.title}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-foreground-muted">Cantidad</p>
              <p className="font-semibold text-foreground">
                {formatCurrency(contribution.amount, contribution.currency)}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Metodo</p>
              <p className="font-medium text-foreground">
                {paymentMethodLabels[contribution.paymentMethod]}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Fecha</p>
              <p className="font-medium text-foreground">
                {formatDate(contribution.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Estado</p>
              <span
                className={cn(
                  "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                  statusStyles[contribution.status as ContributionStatus]
                )}
              >
                {statusLabels[contribution.status as ContributionStatus]}
              </span>
            </div>
          </div>

          {/* Message */}
          {contribution.guestMessage && (
            <div className="mt-4 p-3 bg-accent-yellow/10 rounded-xl">
              <p className="text-xs text-foreground-muted mb-1">Mensaje para el bebe:</p>
              <p className="text-sm text-foreground italic">
                &ldquo;{contribution.guestMessage}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && contribution.status === "pending" && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-foreground/10">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Verificar
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 btn-secondary flex items-center justify-center gap-2 border-state-error/30 text-state-error hover:bg-state-error/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Rechazar
          </button>
        </div>
      )}

      {/* Verified info */}
      {contribution.status === "verified" && contribution.verifiedAt && (
        <div className="mt-4 pt-4 border-t border-foreground/10 text-sm text-foreground-muted">
          Verificado el {formatDate(contribution.verifiedAt)}
        </div>
      )}
    </div>
  );
}
