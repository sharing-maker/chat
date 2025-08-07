"use client";
export function VoiceWaveIcon({ className = "w-5 h-5", animated = false }) {
    return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10v4" className={animated ? "animate-pulse" : ""}/>
      <path d="M6 6v12" className={animated ? "animate-pulse" : ""} style={{ animationDelay: "0.1s" }}/>
      <path d="M10 4v16" className={animated ? "animate-pulse" : ""} style={{ animationDelay: "0.2s" }}/>
      <path d="M14 4v16" className={animated ? "animate-pulse" : ""} style={{ animationDelay: "0.3s" }}/>
      <path d="M18 6v12" className={animated ? "animate-pulse" : ""} style={{ animationDelay: "0.4s" }}/>
      <path d="M22 10v4" className={animated ? "animate-pulse" : ""} style={{ animationDelay: "0.5s" }}/>
    </svg>);
}
