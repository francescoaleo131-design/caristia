"use client";

import { useEffect } from "react";

export default function GoogleReviewsWidget() {
  useEffect(() => {
    // Controlliamo se la piattaforma Elfsight è già stata caricata nel DOM
    const existingScript = document.querySelector('script[src*="elfsightcdn.com"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (

  <div className="w-full my-1 md:my-6 flex justify-center">
    {/* Contenitore fake: tagliamo gli ultimi 30px in basso dove risiede il logo Shapo */}
    <div className="w-full max-h-[375px] md:max-h-[389px] overflow-hidden relative border-b border-zinc-100">
      
      {/* Il Widget originale di Shapo */}
   <div 
        className="elfsight-app-00de7178-e471-4256-bd5f-fe23cac5fdf7" 
        data-elfsight-app-lazy
      ></div>      
    </div>
  </div>
);
}