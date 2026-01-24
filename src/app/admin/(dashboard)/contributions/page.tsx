"use client";

import { useState, useEffect } from "react";
import ContributionCard from "@/components/admin/ContributionCard";
import type { Contribution, Gift } from "@/types";

interface ContributionWithGift extends Contribution {
  gift: Gift;
}

type TabType = "pending" | "verified" | "rejected";

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<ContributionWithGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await fetch("/api/contributions");
      if (!response.ok) {
        throw new Error("Error al cargar contribuciones");
      }
      const data = await response.json();
      setContributions(data);
    } catch (err) {
      console.error("Error fetching contributions:", err);
      setError("Error al cargar las contribuciones");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (contributionId: string) => {
    try {
      const response = await fetch(`/api/contributions/${contributionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "verified" }),
      });

      if (!response.ok) {
        throw new Error("Error al verificar contribucion");
      }

      // Update local state
      setContributions((prev) =>
        prev.map((c) =>
          c.id === contributionId
            ? { ...c, status: "verified", verifiedAt: new Date() }
            : c
        )
      );
    } catch (err) {
      console.error("Error verifying contribution:", err);
      alert("Error al verificar la contribucion");
    }
  };

  const handleReject = async (contributionId: string) => {
    try {
      const response = await fetch(`/api/contributions/${contributionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) {
        throw new Error("Error al rechazar contribucion");
      }

      // Update local state
      setContributions((prev) =>
        prev.map((c) =>
          c.id === contributionId ? { ...c, status: "rejected" } : c
        )
      );
    } catch (err) {
      console.error("Error rejecting contribution:", err);
      alert("Error al rechazar la contribucion");
    }
  };

  const filteredContributions = contributions.filter((c) => c.status === activeTab);

  const tabs: { key: TabType; label: string; count: number }[] = [
    {
      key: "pending",
      label: "Pendientes",
      count: contributions.filter((c) => c.status === "pending").length,
    },
    {
      key: "verified",
      label: "Verificados",
      count: contributions.filter((c) => c.status === "verified").length,
    },
    {
      key: "rejected",
      label: "Rechazados",
      count: contributions.filter((c) => c.status === "rejected").length,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Contribuciones</h1>
          <p className="text-foreground-secondary mt-1">
            Gestiona las contribuciones de los invitados
          </p>
        </div>
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full" />
          <p className="mt-4 text-foreground-muted">Cargando contribuciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-foreground">Contribuciones</h1>
        <p className="text-foreground-secondary mt-1">
          {contributions.length} {contributions.length === 1 ? "contribucion" : "contribuciones"} en total
        </p>
      </div>

      {error && (
        <div className="p-4 bg-state-error/10 border border-state-error/20 rounded-xl">
          <p className="text-sm text-state-error">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-background-light rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-background-white text-foreground shadow-sm"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? "bg-foreground/10"
                    : "bg-foreground/5"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {filteredContributions.length === 0 ? (
        <div className="bg-background-white rounded-2xl border border-foreground/10 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
            {activeTab === "pending" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-foreground-muted"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            {activeTab === "verified" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-foreground-muted"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            {activeTab === "rejected" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-foreground-muted"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {activeTab === "pending" && "No hay contribuciones pendientes"}
            {activeTab === "verified" && "No hay contribuciones verificadas"}
            {activeTab === "rejected" && "No hay contribuciones rechazadas"}
          </h3>
          <p className="text-foreground-muted">
            {activeTab === "pending" &&
              "Las nuevas contribuciones apareceran aqui para que las verifiques"}
            {activeTab === "verified" &&
              "Las contribuciones verificadas se mostraran aqui"}
            {activeTab === "rejected" &&
              "Las contribuciones rechazadas se mostraran aqui"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContributions.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              onVerify={handleVerify}
              onReject={handleReject}
              showActions={activeTab === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
