"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export function AutoScrollAnchor() {
    const anchorRef = useRef(null);
    useEffect(() => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    });
    return _jsx("div", { ref: anchorRef });
}
