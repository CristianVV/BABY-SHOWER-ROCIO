import Link from "next/link";

export default function GraciasPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🌼</div>
        <h1 className="text-3xl font-serif mb-4">¡Gracias!</h1>
        <p className="text-foreground-secondary mb-8">
          Tu contribución ha sido registrada. Una vez que verifiquemos el pago,
          aparecerá en la lista de regalos.
        </p>
        <p className="text-foreground-muted text-sm mb-8">
          Si aún no has enviado el mensaje de WhatsApp, recuerda hacerlo para
          que podamos verificar tu contribución más rápido.
        </p>
        <Link href="/gallery" className="btn-primary">
          Volver a la lista de regalos
        </Link>
      </div>
    </main>
  );
}
