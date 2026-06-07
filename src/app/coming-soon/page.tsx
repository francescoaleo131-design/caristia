export default function ComingSoonPage() {
  return (
    <>
      {/* Header con il Logo */}
      <div className="container mx-auto py-4 px-4 border-b border-gray-50">
        <div className="flex items-center justify-between gap-8">
          <div className="w-48 shrink-0">
            <img
              src="/icon.jpg"
              alt="Logo"
              className="object-contain"
              style={{ height: "80px", width: "auto" }}
            />
          </div>
        </div>
      </div>

      {/* Contenuto Centrale di Manutenzione */}
      <div className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Sito in manutenzione - Giocattoli Caristia 🧸
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-md">
          Stiamo preparando un'esperienza magica per te e per i tuoi bambini. Il nostro sito sarà disponibile a breve!
        </p>
        <div className="mt-8 h-2 w-24 bg-amber-500 rounded-full animate-pulse" />
      </div>
    </>
  );
}