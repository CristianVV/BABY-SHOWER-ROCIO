"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, generateWhatsAppUrl } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

type Step = "info" | "payment" | "confirm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, guestName, guestPhone, setGuestInfo, totalAmount, clearCart } =
    useCart();

  // Check if cart contains ONLY external purchases (no monetary contributions)
  const isExternalOnlyCart =
    items.length > 0 && items.every((item) => item.giftType === "external");
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState(guestName);
  const [phone, setPhone] = useState(guestPhone);
  const [message, setMessage] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("+34649225590");

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push("/gallery");
      return;
    }

    // Fetch payment methods
    fetch("/api/payment-methods")
      .then((res) => res.json())
      .then((data) => {
        // API returns array directly, not wrapped in { success, data }
        const methods = Array.isArray(data) ? data : data.data || [];
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedPayment(methods[0].type);
        }
      });

    // Fetch settings for WhatsApp number
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        // API returns settings directly, not wrapped in { success, data }
        const settings = data.data || data;
        if (settings.whatsappNumber) {
          setWhatsappNumber(settings.whatsappNumber);
        }
      });
  }, [items.length, router]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    setGuestInfo(name, phone);
    setError("");
    // Skip payment step for external-only carts
    setStep(isExternalOnlyCart ? "confirm" : "payment");
  };

  const handlePaymentSelect = () => {
    if (!selectedPayment) {
      setError("Por favor selecciona un método de pago");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Submit each cart item as a contribution
      for (const item of items) {
        // External purchases don't require payment - they bought from Amazon, etc.
        const isExternalPurchase = item.giftType === "external";

        // For external purchases, use the checkout form message (not the cart item message)
        // For other types, use item-specific message or fall back to checkout form message
        const guestMessage = isExternalPurchase
          ? message // Use checkout form message for external purchases
          : item.message || message; // Use item message or checkout form message

        const res = await fetch("/api/contributions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            giftId: item.giftId,
            guestName: name,
            guestPhone: phone,
            guestMessage,
            amount: item.amount,
            currency: item.currency,
            paymentMethod: selectedPayment,
            isExternalPurchase, // Flag for external purchases (no payment verification needed)
          }),
        });

        if (!res.ok) {
          throw new Error("Error al enviar la contribución");
        }
      }

      // Generate WhatsApp message
      const giftNames = items.map((i) => i.giftTitle).join(", ");
      const hasMonetaryContributions = totalAmount > 0;
      const total = formatCurrency(totalAmount, items[0]?.currency || "EUR");

      // Different message for external purchases vs monetary contributions
      const whatsappMessage = hasMonetaryContributions
        ? `¡Hola! Acabo de hacer una contribución para el baby shower de Rocío.

Regalo(s): ${giftNames}
Cantidad: ${total}
Método: ${selectedPayment}
Nombre: ${name}

¡Gracias! 🌼`
        : `¡Hola! Acabo de comprar un regalo para el baby shower de Rocío.

Regalo(s): ${giftNames}
Nombre: ${name}

¡Gracias! 🌼`;

      const whatsappUrl = generateWhatsAppUrl(whatsappNumber, whatsappMessage);

      // Clear cart and redirect
      clearCart();

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");

      // Redirect to thank you page
      router.push("/gracias");
    } catch {
      setError(
        "Hubo un error al procesar tu contribución. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMethod = paymentMethods.find((m) => m.type === selectedPayment);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-serif text-center mb-8">Checkout</h1>

        {/* Progress indicator - 2 steps for external-only, 3 for others */}
        <div className="flex justify-center gap-2 mb-8">
          {(isExternalOnlyCart
            ? ["info", "confirm"]
            : (["info", "payment", "confirm"] as Step[])
          ).map((s, i, arr) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === s
                  ? "bg-accent-yellow"
                  : i < arr.indexOf(step)
                    ? "bg-accent-green"
                    : "bg-foreground/20"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "info" && (
            <motion.form
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleInfoSubmit}
              className="card p-6 space-y-4"
            >
              <h2 className="text-xl font-serif mb-4">Tus datos</h2>

              <div>
                <label className="label block mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="label block mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input w-full"
                  placeholder="+34 600 000 000"
                  required
                />
              </div>

              <div>
                <label className="label block mb-1">
                  Mensaje para el bebé (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input w-full min-h-[100px] py-3"
                  placeholder="Escribe un mensaje especial..."
                />
              </div>

              {error && <p className="text-state-error text-sm">{error}</p>}

              <button type="submit" className="btn-primary w-full">
                {isExternalOnlyCart ? "Confirmar la compra" : "Continuar"}
              </button>
            </motion.form>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6 space-y-4"
            >
              <h2 className="text-xl font-serif mb-4">Método de pago</h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.type}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedPayment === method.type
                        ? "border-accent-yellow bg-accent-yellow/10"
                        : "border-foreground/10 hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.type}
                      checked={selectedPayment === method.type}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.type
                          ? "border-accent-yellow"
                          : "border-foreground/30"
                      }`}
                    >
                      {selectedPayment === method.type && (
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-foreground-muted">
                        {method.currency}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {error && <p className="text-state-error text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("info")}
                  className="btn-secondary flex-1"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handlePaymentSelect}
                  className="btn-primary flex-1"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6 space-y-6"
            >
              <h2 className="text-xl font-serif mb-4">
                {isExternalOnlyCart ? "Confirmar compra" : "Confirmar y pagar"}
              </h2>

              {/* Order summary */}
              <div className="space-y-3 pb-4 border-b border-foreground/10">
                {items.map((item) => (
                  <div key={item.giftId} className="flex justify-between">
                    <span className="text-foreground-secondary">
                      {item.giftTitle}
                    </span>
                    {item.giftType !== "external" && (
                      <span className="font-medium">
                        {formatCurrency(item.amount, item.currency)}
                      </span>
                    )}
                    {item.giftType === "external" && (
                      <span className="text-accent-green text-sm">
                        Compra externa ✓
                      </span>
                    )}
                  </div>
                ))}
                {/* Only show total for monetary contributions */}
                {!isExternalOnlyCart && (
                  <div className="flex justify-between text-lg font-medium pt-2">
                    <span>Total</span>
                    <span>
                      {formatCurrency(totalAmount, items[0]?.currency || "EUR")}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment instructions - only for monetary contributions */}
              {!isExternalOnlyCart && selectedMethod && (
                <div className="bg-background-light rounded-xl p-4">
                  <h3 className="font-medium mb-2">
                    Instrucciones de pago - {selectedMethod.label}
                  </h3>
                  {selectedMethod.type === "bizum" && (
                    <p className="text-foreground-secondary">
                      Envía el Bizum al número:{" "}
                      <span className="font-mono font-medium">
                        {selectedMethod.value}
                      </span>
                    </p>
                  )}
                  {selectedMethod.type === "revolut" && (
                    <p className="text-foreground-secondary">
                      Envía el pago a través de Revolut:{" "}
                      <a
                        href={selectedMethod.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-green underline"
                      >
                        Abrir Revolut
                      </a>
                    </p>
                  )}
                  {selectedMethod.type === "bancolombia" && (
                    <p className="text-foreground-secondary">
                      Realiza la transferencia a Bancolombia con estos datos:{" "}
                      <span className="font-mono">{selectedMethod.value}</span>
                    </p>
                  )}
                </div>
              )}

              <p className="text-sm text-foreground-muted text-center">
                {isExternalOnlyCart
                  ? "¡Gracias por comprar el regalo! La familia lo recibirá pronto. 🎁"
                  : "Tu contribución aparecerá una vez que la familia verifique la transferencia."}
              </p>

              {error && <p className="text-state-error text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setStep(isExternalOnlyCart ? "info" : "payment")
                  }
                  className="btn-secondary flex-1"
                  disabled={isSubmitting}
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar y enviar WhatsApp"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
