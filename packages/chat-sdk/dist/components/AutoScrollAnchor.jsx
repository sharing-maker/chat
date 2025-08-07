"use client";
import { useEffect, useRef } from "react";
export function AutoScrollAnchor() {
    const anchorRef = useRef(null);
    useEffect(() => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    });
    return <div ref={anchorRef}/>;
}
