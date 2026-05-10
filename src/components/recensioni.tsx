"use client"
import { useEffect, useState, useRef } from 'react'

export default function RecensioniGoogle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Evitiamo caricamenti doppi
    if (loaded) return;

    // 2. Creiamo lo script manualmente
    const script = document.createElement('script');
    script.src = "https://cdn.trustindex.io/loader.js?ddfdea2713455963cd26aa92118";
    script.async = true;
    script.defer = true;
    
    // 3. Lo appendiamo al contenitore invece che al body
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <section className="py-12 bg-zinc-50 min-h-[400px]">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Il contenitore dove iniettiamo lo script e dove apparirà il widget */}
        <div ref={containerRef} className="trustindex-container">
          {/* Questo div interno è per sicurezza */}
          <div className="ti-widget" data-widget-id="ddfdea2713455963cd26aa92118"></div>
        </div>
      </div>
    </section>
  )
}