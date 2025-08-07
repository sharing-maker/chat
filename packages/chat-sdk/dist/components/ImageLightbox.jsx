"use client";
import { X } from "lucide-react";
import Image from "next/image";
export function ImageLightbox({ src, alt, onClose }) {
    return (<div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors z-50" aria-label="Close image">
        <X className="w-6 h-6"/>
      </button>
      <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <Image src={src || "/placeholder.svg"} alt={alt} width={1200} // Max width for lightbox image
     height={800} // Max height for lightbox image
     style={{ width: "auto", height: "auto", maxWidth: "90vw", maxHeight: "90vh" }} className="rounded-lg shadow-xl object-contain" priority // Load immediately
    />
      </div>
    </div>);
}
