import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  bars?: number;
  animated?: boolean;
  color?: "purple" | "pink" | "cyan";
}

export function Waveform({ 
  className, 
  bars = 8, 
  animated = true,
  color = "purple" 
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    purple: "bg-accent-purple",
    pink: "bg-accent-pink", 
    cyan: "bg-accent-cyan"
  };

  return (
    <div 
      ref={containerRef}
      className={cn("flex items-end space-x-1", className)}
    >
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-300",
            colorClasses[color],
            animated && "animate-waveform"
          )}
          style={{
            height: `${Math.random() * 60 + 20}%`,
            animationDelay: animated ? `${i * 0.1}s` : "0s"
          }}
        />
      ))}
    </div>
  );
}
