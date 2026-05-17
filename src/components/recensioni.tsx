"use client";

import { useEffect } from "react";

export default function ShapoWidget() {
  useEffect(() => {
    // Controlliamo se lo script è già stato caricato per evitare duplicati
    const existingScript = document.getElementById("shapo-embed-js");
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "shapo-embed-js";
      script.type = "text/javascript";
      script.src = "https://cdn.shapo.io/js/embed.js";
      script.defer = true;
      document.body.appendChild(script);
    }
    // Osserva il widget e cancella il watermark appena appare
  const observer = new MutationObserver(() => {
    const watermark = document.querySelector('[id^="shapo-widget-"] a[href*="shapo.io"]');
    if (watermark) {
      watermark.remove();
    }
  });

  const target = document.getElementById("shapo-widget-75a58ab3677f54c6a473");
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }

  return () => observer.disconnect();
  }, []);

return (

  <div className="w-full my-6 flex justify-center">
    {/* Contenitore fake: tagliamo gli ultimi 30px in basso dove risiede il logo Shapo */}
    <div className="w-full max-h-[320px] overflow-hidden relative border-b border-zinc-100">
      
      {/* Il Widget originale di Shapo */}
      <div id="shapo-widget-75a58ab3677f54c6a473"></div>
      
    </div>
  </div>
);
}