"use client";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-slate-200 animate-pulse rounded-2xl ${className}`} />
);

export default function StoreSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header dello Store: Titolo e Filtri */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" /> {/* Titolo Categoria */}
          <Skeleton className="h-5 w-96 opacity-60" /> {/* Sottotitolo/Breadcrumb */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32 rounded-xl" /> {/* Tasto Filtra */}
          <Skeleton className="h-12 w-48 rounded-xl" /> {/* Ordinamento */}
        </div>
      </div>

      {/* Griglia Prodotti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group space-y-4">
            {/* Contenitore Immagine */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 p-8 border border-slate-50">
               <Skeleton className="w-full h-full rounded-3xl opacity-50" />
               
               {/* Badge "Novità" o "Sconto" simulato */}
               <div className="absolute top-4 left-4">
                 <Skeleton className="h-6 w-16 rounded-full" />
               </div>
            </div>

            {/* Info Prodotto */}
            <div className="px-2 space-y-3">
              <div className="space-y-1">
                <Skeleton className="h-5 w-full" /> {/* Titolo Riga 1 */}
                <Skeleton className="h-5 w-2/3" />  {/* Titolo Riga 2 */}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-20" /> {/* Prezzo */}
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Tasto Quick Add */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}