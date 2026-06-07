export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="flex flex-col items-center max-w-xl">
        
        {/* Logo centrato sopra il titolo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/icon.jpg"
            alt="Logo Giocattoli Caristia"
            className="object-contain rounded-2xl shadow-sm"
            style={{ height: "120px", width: "auto" }} // Ho ingrandito leggermente il logo per farlo risaltare di più
          />
        </div>

        {/* Testo di Manutenzione */}
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Sito in manutenzione
        </h1>
        <h2 className="text-2xl font-bold text-amber-600 mt-2">
          Giocattoli Caristia 🧸
        </h2>
        
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Stiamo preparando un'esperienza magica per te e per i tuoi bambini. 
          Il nostro nuovo shop online sarà disponibile a breve!
        </p>

        {/* Indicatore animato */}
        <div className="mt-8 h-1.5 w-20 bg-amber-500 rounded-full animate-pulse" />
        
      </div>
    </div>
  );
}