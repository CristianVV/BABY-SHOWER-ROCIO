"use client";

import { useState, useEffect } from "react";

interface SiteSettings {
  guestPassword: string;
  adminPassword: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  heroMessage: string;
  whatsappNumber: string;
}

const defaultSettings: SiteSettings = {
  guestPassword: "",
  adminPassword: "",
  eventTitle: "Baby Shower de Rocio",
  eventDate: "15 de febrero de 2026",
  eventTime: "13:00h",
  eventLocation: "Calle de la Azalea, Alcobendas, Madrid",
  heroMessage:
    "Gracias por acompanarnos en esta celebracion tan especial. Tu carino y generosidad significan el mundo para nosotros.",
  whatsappNumber: "+34649225590",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    guest: false,
    admin: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Error al cargar configuracion");
      }
      const data = await response.json();
      setSettings({
        guestPassword: data.guestPassword || "",
        adminPassword: data.adminPassword || "",
        eventTitle: data.eventTitle || defaultSettings.eventTitle,
        eventDate: data.eventDate || defaultSettings.eventDate,
        eventTime: data.eventTime || defaultSettings.eventTime,
        eventLocation: data.eventLocation || defaultSettings.eventLocation,
        heroMessage: data.heroMessage || defaultSettings.heroMessage,
        whatsappNumber: data.whatsappNumber || defaultSettings.whatsappNumber,
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Error al cargar la configuracion");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar configuracion");
      }

      setSuccess("Configuracion guardada correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Ajustes</h1>
          <p className="text-foreground-secondary mt-1">
            Configura los ajustes del sitio
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
        <h1 className="font-serif text-3xl text-foreground">Ajustes</h1>
        <p className="text-foreground-secondary mt-1">
          Configura los ajustes generales del sitio
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Passwords Section */}
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Contrasenas</h2>

          <div className="space-y-6">
            {/* Guest Password */}
            <div>
              <label htmlFor="guestPassword" className="label block mb-2">
                Contrasena de invitados
              </label>
              <div className="relative">
                <input
                  id="guestPassword"
                  type={showPasswords.guest ? "text" : "password"}
                  value={settings.guestPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, guestPassword: e.target.value })
                  }
                  placeholder="Contrasena para acceder al sitio"
                  className="input w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, guest: !showPasswords.guest })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showPasswords.guest ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                La contrasena que los invitados usan para acceder al registro de regalos
              </p>
            </div>

            {/* Admin Password */}
            <div>
              <label htmlFor="adminPassword" className="label block mb-2">
                Contrasena de administrador
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPasswords.admin ? "text" : "password"}
                  value={settings.adminPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, adminPassword: e.target.value })
                  }
                  placeholder="Contrasena de administrador"
                  className="input w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, admin: !showPasswords.admin })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showPasswords.admin ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                La contrasena para acceder a este panel de administracion (minimo 8 caracteres)
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Detalles del Evento</h2>

          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <label htmlFor="eventTitle" className="label block mb-2">
                Titulo del evento
              </label>
              <input
                id="eventTitle"
                type="text"
                value={settings.eventTitle}
                onChange={(e) =>
                  setSettings({ ...settings, eventTitle: e.target.value })
                }
                placeholder="Baby Shower de Rocio"
                className="input w-full"
              />
            </div>

            {/* Event Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="label block mb-2">
                  Fecha
                </label>
                <input
                  id="eventDate"
                  type="text"
                  value={settings.eventDate}
                  onChange={(e) =>
                    setSettings({ ...settings, eventDate: e.target.value })
                  }
                  placeholder="15 de febrero de 2026"
                  className="input w-full"
                />
              </div>
              <div>
                <label htmlFor="eventTime" className="label block mb-2">
                  Hora
                </label>
                <input
                  id="eventTime"
                  type="text"
                  value={settings.eventTime}
                  onChange={(e) =>
                    setSettings({ ...settings, eventTime: e.target.value })
                  }
                  placeholder="13:00h"
                  className="input w-full"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="eventLocation" className="label block mb-2">
                Ubicacion
              </label>
              <input
                id="eventLocation"
                type="text"
                value={settings.eventLocation}
                onChange={(e) =>
                  setSettings({ ...settings, eventLocation: e.target.value })
                }
                placeholder="Calle de la Azalea, Alcobendas, Madrid"
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Mensajes</h2>

          <div className="space-y-6">
            {/* Hero Message */}
            <div>
              <label htmlFor="heroMessage" className="label block mb-2">
                Mensaje de bienvenida
              </label>
              <textarea
                id="heroMessage"
                value={settings.heroMessage}
                onChange={(e) =>
                  setSettings({ ...settings, heroMessage: e.target.value })
                }
                placeholder="Gracias por acompanarnos..."
                rows={4}
                className="input w-full resize-none"
              />
              <p className="text-xs text-foreground-muted mt-1">
                El mensaje que aparece en la pagina principal
              </p>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label htmlFor="whatsappNumber" className="label block mb-2">
                Numero de WhatsApp
              </label>
              <input
                id="whatsappNumber"
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                placeholder="+34649225590"
                className="input w-full"
              />
              <p className="text-xs text-foreground-muted mt-1">
                El numero al que los invitados enviaran confirmacion de pago
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          ) : (
            "Guardar Configuracion"
          )}
        </button>
      </form>
    </div>
  );
}
