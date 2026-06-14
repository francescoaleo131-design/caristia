import { Mail, Phone, MapPin } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-[#4a69bd] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="flex flex-col gap-4">
            <img
              src="/icon.jpg"
              alt="Logo Giocattoli Caristia"
              className="h-16 w-auto object-contain bg-white rounded-lg p-1 self-start"
              style={{ height: "64px", width: "auto" }}
            />
            <div className="text-sm leading-relaxed opacity-90">
              <p className="font-bold text-lg">Giocattoli Caristia</p>
              <p>di Angelo Caristia</p>
              <div className="flex items-start gap-2 mt-3">
                <MapPin size={16} className="shrink-0 mt-1" />
                <span>Via Madonna della Via, 74/C<br />95041 Caltagirone (CT)</span>
              </div>
              <p className="mt-2 text-xs font-mono">P.IVA 05611050872</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider border-b border-white/20 pb-2">Contatti</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-center gap-3 hover:text-[#8cc665] transition-colors">
                <Phone size={18} />
                <a href="tel:+39093326865">+39 0933 26865</a>
              </li>
              <li className="flex items-center gap-3 hover:text-[#8cc665] transition-colors">
                <Mail size={18} />
                <a href="mailto:info@giocattolicaristia.it">info@giocattolicaristia.it</a>
              </li>
<li className="flex items-center gap-3">
  <a 
    href="https://wa.me/393384083646" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 hover:text-[#8cc665] transition-colors"
  >
    <div className="w-[18px] flex justify-center text-white">
      <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
    </div>
    <span>+39 338 408 3646</span>
  </a>
</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider border-b border-white/20 pb-2">Orari di Apertura</h3>
            <ul className="text-sm flex flex-col gap-2 opacity-90">
              <li className="flex justify-between font-semibold border-b border-white/10 pb-1">
                <span>Lunedì - Sabato:</span>
              </li>
              <li className="flex justify-between pl-2">
                <span>Mattina:</span>
                <span>09:00 - 13:00</span>
              </li>
              <li className="flex justify-between pl-2">
                <span>Pomeriggio:</span>
                <span>16:00 - 20:30</span>
              </li>
              <li className="flex justify-between font-semibold border-b border-white/10 pb-1 mt-2 text-red-200">
                <span>Domenica:</span>
                <span>Chiuso</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider border-b border-white/20 pb-2">Info Legali</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="/tos" className="hover:text-[#8cc665] transition-colors">Termini E Condizioni</a></li>
              <li><a href="/return_policy" className="hover:text-[#8cc665] transition-colors">Politica Di Rimborso</a></li>
              <li><a href="/privacy" className="hover:text-[#8cc665] transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="hover:text-[#8cc665] transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="bg-[#3c559c] py-6 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] opacity-80 text-center md:text-left">
          <p>© Copyright 2026 Giocattoli Caristia di Angelo Caristia | Tutti i diritti riservati.</p>
          <a href="https://www.instagram.com/ciccioinpurple/" target="_blank" rel="noopener noreferrer">
            <p>C.F. CRSNGL90M16B428D | Created by <span className=" font-bold text-[#310d69]">ciccioinpurple</span></p>
          </a>
        </div>
      </div>
    </footer>
  );
}