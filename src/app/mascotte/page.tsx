"use client"
import React, { useState } from "react"
import MascotteHero from "@/components/MascotteHero"
import MascottePackages from "@/components/MascottePackages"
import MascotteBookingForm from "@/components/MascotteBookingForm"
import VantaggiPromo from "@/components/vantaggi"
import MascotteDisponibili from "@/components/MascotteDisponibili"
import CostumiDisponibili from "@/components/CostumiDisponibili"

export default function MascottePage() {
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const [selectedMascot, setSelectedMascot] = useState<string>("")

    const handleSelectMascot = (name: string) => {
        setSelectedMascot(name)
        if (!selectedPackage) {
            document.getElementById('pacchetti-sezione')?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="w-full flex flex-col pb-20">

            <MascotteHero />

            <div className="w-full mt-6 mb-12 px-4 container mx-auto">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/mobile_divider_mascotte.webp" />

                    <img
                        src="/divider_mascotte.webp"
                        alt="Promozione Giocattoli"
                        className="w-full h-auto"
                        style={{ maxHeight: "300px" }}
                    />
                </picture>
            </div>

            <div className="text-xl text-center text-black-200">
                <h2 className="text-center">Mascotte</h2>
            </div>
            <MascotteDisponibili onSelectMascot={handleSelectMascot} />
            <div className="text-xl text-center text-black-200">
                <h2 className="text-center">Costumi</h2>
            </div>
            <CostumiDisponibili onSelectCostume={handleSelectMascot} />
            <div className="w-full my-6 px-4 container mx-auto">
                <div className="h-px bg-slate-100 w-full" />
            </div>
            <div className="w-full mt-6 mb-12 px-4 container mx-auto">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/mobile_divider_pacchetti.webp" />
                    <img
                        src="/divider_pacchetti.webp"
                        alt="Promozione Giocattoli"
                        className="w-full h-auto"
                        style={{ maxHeight: "300px" }}
                    />
                </picture>
            </div>
            <div id="pacchetti-sezione">
                <MascottePackages onSelect={(pkg) => setSelectedPackage(pkg)} />
            </div>


            {selectedPackage && (
                <MascotteBookingForm
                    packageInfo={selectedPackage}
                    initialMascot={selectedMascot}
                    onClose={() => {
                        setSelectedPackage(null)
                        setSelectedMascot("")
                    }}
                />
            )}

            <div className="w-full my-12 px-4 container mx-auto">
                <img
                    src="/divider_4.webp"
                    alt="Promozione Giocattoli"
                    className="w-full h-auto"
                    style={{ maxHeight: "400px" }}
                />
            </div>
        </div>
    )
}