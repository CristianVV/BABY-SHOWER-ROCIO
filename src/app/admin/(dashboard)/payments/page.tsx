"use client";

import { useState, useEffect } from "react";

interface PaymentMethod {
  id?: string;
  type: "bizum" | "revolut" | "bancolombia";
  label: string;
  value: string;
  currency: "EUR" | "COP";
  enabled: boolean;
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    type: "bizum",
    label: "Bizum",
    value: "+34649225590",
    currency: "EUR",
    enabled: true,
  },
  {
    type: "revolut",
    label: "Revolut",
    value: "",
    currency: "EUR",
    enabled: false,
  },
  {
    type: "bancolombia",
    label: "Bancolombia",
    value: "",
    currency: "COP",
    enabled: false,
  },
];

export default function AdminPaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payments");
      if (!response.ok) {
        throw new Error("Error al cargar metodos de pago");
      }
      const result = await response.json();
      const data = result.data || result;

      if (Array.isArray(data) && data.length > 0) {
        // Merge fetched data with defaults
        const merged = defaultPaymentMethods.map((defaultMethod) => {
          const found = data.find((m: PaymentMethod) => m.type === defaultMethod.type);
          return found || defaultMethod;
        });
        setPaymentMethods(merged);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (type: string, field: keyof PaymentMethod, value: string | boolean) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.type === type ? { ...method, [field]: value } : method
      )
    );
  };

  const handleSave = async (method: PaymentMethod) => {
    setSaving(method.type);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(method),
      });

      if (!response.ok) {
        throw new Error("Error al guardar metodo de pago");
      }

      setSuccess(`${method.label} guardado correctamente`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving payment method:", err);
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Metodos de Pago</h1>
          <p className="text-foreground-secondary mt-1">
            Configura los metodos de pago disponibles
          </p>
        </div>
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full" />
          <p className="mt-4 text-foreground-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-foreground">Metodos de Pago</h1>
        <p className="text-foreground-secondary mt-1">
          Configura los metodos de pago disponibles para los invitados
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-state-error/10 border border-state-error/20 rounded-xl">
          <p className="text-sm text-state-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-state-success/10 border border-state-success/20 rounded-xl">
          <p className="text-sm text-state-success">{success}</p>
        </div>
      )}

      {/* Bizum */}
      <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00A0E1]/10 flex items-center justify-center">
              <span className="text-lg font-bold text-[#00A0E1]">B</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Bizum</h3>
              <p className="text-sm text-foreground-muted">Pagos en euros (Espana)</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.find((m) => m.type === "bizum")?.enabled || false}
              onChange={(e) => handleUpdate("bizum", "enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-state-success"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bizum-phone" className="label block mb-2">
              Numero de telefono
            </label>
            <input
              id="bizum-phone"
              type="tel"
              value={paymentMethods.find((m) => m.type === "bizum")?.value || ""}
              onChange={(e) => handleUpdate("bizum", "value", e.target.value)}
              placeholder="+34 600 000 000"
              className="input w-full"
            />
            <p className="text-xs text-foreground-muted mt-1">
              El numero donde recibiras los pagos de Bizum
            </p>
          </div>

          <button
            onClick={() => {
              const method = paymentMethods.find((m) => m.type === "bizum");
              if (method) handleSave(method);
            }}
            disabled={saving === "bizum"}
            className="btn-primary w-full"
          >
            {saving === "bizum" ? "Guardando..." : "Guardar Bizum"}
          </button>
        </div>
      </div>

      {/* Revolut */}
      <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0075EB]/10 flex items-center justify-center">
              <span className="text-lg font-bold text-[#0075EB]">R</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Revolut</h3>
              <p className="text-sm text-foreground-muted">Pagos en euros (Internacional)</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.find((m) => m.type === "revolut")?.enabled || false}
              onChange={(e) => handleUpdate("revolut", "enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-state-success"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="revolut-link" className="label block mb-2">
              Enlace de pago
            </label>
            <input
              id="revolut-link"
              type="url"
              value={paymentMethods.find((m) => m.type === "revolut")?.value || ""}
              onChange={(e) => handleUpdate("revolut", "value", e.target.value)}
              placeholder="https://revolut.me/tunombre"
              className="input w-full"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Tu enlace de Revolut.me para recibir pagos
            </p>
          </div>

          <button
            onClick={() => {
              const method = paymentMethods.find((m) => m.type === "revolut");
              if (method) handleSave(method);
            }}
            disabled={saving === "revolut"}
            className="btn-primary w-full"
          >
            {saving === "revolut" ? "Guardando..." : "Guardar Revolut"}
          </button>
        </div>
      </div>

      {/* Bancolombia */}
      <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FDDA24]/20 flex items-center justify-center">
              <span className="text-lg font-bold text-[#002855]">BC</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Bancolombia</h3>
              <p className="text-sm text-foreground-muted">Pagos en pesos colombianos</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.find((m) => m.type === "bancolombia")?.enabled || false}
              onChange={(e) => handleUpdate("bancolombia", "enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-state-success"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bancolombia-link" className="label block mb-2">
              Enlace o informacion de pago
            </label>
            <textarea
              id="bancolombia-link"
              value={paymentMethods.find((m) => m.type === "bancolombia")?.value || ""}
              onChange={(e) => handleUpdate("bancolombia", "value", e.target.value)}
              placeholder="Numero de cuenta, enlace QR, o instrucciones..."
              rows={3}
              className="input w-full resize-none"
            />
            <p className="text-xs text-foreground-muted mt-1">
              Informacion necesaria para recibir transferencias de Bancolombia
            </p>
          </div>

          <button
            onClick={() => {
              const method = paymentMethods.find((m) => m.type === "bancolombia");
              if (method) handleSave(method);
            }}
            disabled={saving === "bancolombia"}
            className="btn-primary w-full"
          >
            {saving === "bancolombia" ? "Guardando..." : "Guardar Bancolombia"}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl p-4">
        <div className="flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Nota importante</p>
            <p className="text-foreground-secondary">
              Solo los metodos habilitados se mostraran a los invitados. Asegurate de
              configurar correctamente la informacion antes de activar cada metodo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
