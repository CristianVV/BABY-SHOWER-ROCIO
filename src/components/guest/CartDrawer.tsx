"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (giftId: string) => void;
  onCheckout: () => void;
  currency: "EUR" | "COP";
  className?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
  currency,
  className,
}: CartDrawerProps) {
  // Calculate total
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  // Count items (excluding external purchases with 0 amount)
  const itemCount = items.filter((item) => item.amount > 0).length;
  const externalPurchases = items.filter((item) => item.amount === 0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background-white shadow-xl flex flex-col",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-foreground/10">
              <div>
                <h2 className="font-serif text-xl text-foreground">
                  Tu Carrito
                </h2>
                <p className="text-sm text-foreground-muted">
                  {items.length === 0
                    ? "Vacio"
                    : `${items.length} ${items.length === 1 ? "articulo" : "articulos"}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart content */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 mb-4 opacity-30">
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
                  <p className="text-foreground-secondary mb-2">
                    Tu carrito esta vacio
                  </p>
                  <p className="text-foreground-muted text-sm">
                    Explora los regalos y anade tus contribuciones
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Contributions */}
                  {items
                    .filter((item) => item.amount > 0)
                    .map((item) => (
                      <div
                        key={item.giftId}
                        className="card p-4 flex items-start gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.giftTitle}
                          </h3>
                          <p className="text-sm text-foreground-secondary mt-1">
                            {formatCurrency(item.amount, item.currency)}
                          </p>
                          {item.message && (
                            <p className="text-xs text-foreground-muted mt-2 italic line-clamp-2">
                              "{item.message}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.giftId)}
                          className="p-1.5 hover:bg-state-error/10 rounded-lg transition-colors text-foreground-muted hover:text-state-error"
                          aria-label="Eliminar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                  {/* External purchases section */}
                  {externalPurchases.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-4">
                        <div className="h-px flex-1 bg-foreground/10" />
                        <span className="text-xs text-foreground-muted">
                          Compras externas
                        </span>
                        <div className="h-px flex-1 bg-foreground/10" />
                      </div>
                      {externalPurchases.map((item) => (
                        <div
                          key={item.giftId}
                          className="card p-4 flex items-start gap-4 bg-accent-green/5"
                        >
                          <div className="p-2 rounded-full bg-state-success/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-state-success"
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
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {item.giftTitle}
                            </h3>
                            <p className="text-sm text-state-success mt-1">
                              Marcado como comprado
                            </p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.giftId)}
                            className="p-1.5 hover:bg-state-error/10 rounded-lg transition-colors text-foreground-muted hover:text-state-error"
                            aria-label="Eliminar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-foreground/10 p-5 space-y-4">
                {/* Total */}
                {total > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary">Total a pagar</span>
                    <span className="font-serif text-2xl text-foreground">
                      {formatCurrency(total, currency)}
                    </span>
                  </div>
                )}

                {/* Checkout button */}
                <Button
                  onClick={onCheckout}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Continuar al pago
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>

                {/* Security note */}
                <p className="text-xs text-foreground-muted text-center">
                  El pago se realiza manualmente via Bizum, Revolut o Bancolombia
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
