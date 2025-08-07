"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
export function ImagePreviewModal({ images, initialImageId, onClose }) {
    // Find the initial index based on initialImageId
    const initialIndex = images.findIndex((img) => img.id === initialImageId);
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
    // Ensure currentImageIndex is valid if initialImageId wasn't found or images array is empty
    useEffect(() => {
        if (initialIndex === -1 && images.length > 0) {
            setCurrentImageIndex(0);
        }
        else if (images.length === 0) {
            onClose(); // Close if no images are provided
        }
    }, [initialImageId, images, initialIndex, onClose]);
    const currentImage = images[currentImageIndex];
    const handlePrev = useCallback(() => {
        setCurrentImageIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }, []);
    const handleNext = useCallback(() => {
        setCurrentImageIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1));
    }, [images.length]);
    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            onClose();
        }
        else if (event.key === "ArrowLeft") {
            handlePrev();
        }
        else if (event.key === "ArrowRight") {
            handleNext();
        }
    }, [onClose, handlePrev, handleNext]);
    // Add and remove keyboard event listener
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);
    if (!currentImage) {
        return null; // Or render a loading/error state
    }
    const isFirstImage = currentImageIndex === 0;
    const isLastImage = currentImageIndex === images.length - 1;
    return (_jsxs("div", { className: "fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4 sm:p-8", onClick: onClose, children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors z-50", "aria-label": "\u0110\u00F3ng", title: "\u0110\u00F3ng (Esc)", children: _jsx(X, { className: "w-6 h-6" }) }), _jsxs("div", { className: "relative flex items-center justify-center w-full h-full max-w-screen-xl max-h-screen-xl", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { onClick: handlePrev, disabled: isFirstImage, className: `absolute left-2 sm:left-4 p-3 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/70 transition-colors z-40
            ${isFirstImage ? "opacity-50 cursor-not-allowed" : ""}`, "aria-label": "\u1EA2nh tr\u01B0\u1EDBc", title: "\u1EA2nh tr\u01B0\u1EDBc (M\u0169i t\u00EAn tr\u00E1i)", children: _jsx(ChevronLeft, { className: "w-6 h-6 sm:w-8 sm:h-8" }) }), _jsx("div", { className: "relative w-full h-full flex items-center justify-center", children: _jsx(Image, { src: currentImage.url || "/placeholder.svg", alt: currentImage.name || "Xem trước hình ảnh", layout: "fill" // Use fill to make it responsive within its parent
                            , objectFit: "contain" // Ensure the image fits within the container without cropping
                            , className: "rounded-lg shadow-xl", priority // Load immediately for better UX
                            : true }) }), _jsx("button", { onClick: handleNext, disabled: isLastImage, className: `absolute right-2 sm:right-4 p-3 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/70 transition-colors z-40
            ${isLastImage ? "opacity-50 cursor-not-allowed" : ""}`, "aria-label": "\u1EA2nh ti\u1EBFp theo", title: "\u1EA2nh ti\u1EBFp theo (M\u0169i t\u00EAn ph\u1EA3i)", children: _jsx(ChevronRight, { className: "w-6 h-6 sm:w-8 sm:h-8" }) })] }), _jsxs("div", { className: "absolute bottom-4 text-white text-sm sm:text-base bg-black/50 px-4 py-2 rounded-full", children: [currentImage.name || "Hình ảnh", " (", currentImageIndex + 1, " / ", images.length, ")"] })] }));
}
