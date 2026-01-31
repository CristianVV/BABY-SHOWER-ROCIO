"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { generateWhatsAppUrl } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface ExternalPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: string;
  giftTitle: string;
}

export default function ExternalPurchaseModal({
  isOpen,
  onClose,
  giftId,
  giftTitle,
}: ExternalPurchaseModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("+34649225590");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          const settings = data.data || data;
          if (settings.whatsappNumber) {
            setWhatsappNumber(settings.whatsappNumber);
          }
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("Por favor completa tu nombre y teléfono");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId,
          guestName: name.trim(),
          guestPhone: phone.trim(),
          guestMessage: message.trim() || undefined,
          amount: 0,
          currency: "EUR",
          paymentMethod: "external",
          isExternalPurchase: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar la compra");
      }

      const whatsappMessage = `¡Hola! Acabo de comprar un regalo para el baby shower de Rocío.

Regalo: ${giftTitle}
Nombre: ${name}
${message ? `Mensaje: ${message}` : ""}

¡Gracias! 🌼`;

      const whatsappUrl = generateWhatsAppUrl(whatsappNumber, whatsappMessage);
      window.open(whatsappUrl, "_blank");
      onClose();
      router.push("/gracias");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Hubo un error al registrar tu compra. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-serif text-gray-900">¡Gracias por tu compra!</h2>
              <p className="text-gray-600 text-sm mt-1">Confirma tus datos para notificar a la familia</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl mb-5 border border-amber-200">
            <p className="text-sm text-amber-700">Regalo:</p>
            <p className="font-medium text-amber-900">{giftTitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu nombre *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="¿Cómo te llamas?" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu teléfono *</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+34 600 000 000" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none" 
                required 
              />
            </div>

            <button 
              type="button" 
              onClick={() => setShowMessage(!showMessage)} 
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showMessage ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showMessage ? "Ocultar mensaje" : "Añadir mensaje para el bebé (opcional)"}
            </button>

            {showMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
              >
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Escribe un mensaje especial..." 
                  rows={3} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none resize-none" 
                />
              </motion.div>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar WhatsApp
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
