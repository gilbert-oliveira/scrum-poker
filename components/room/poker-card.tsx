import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PokerCardProps extends HTMLAttributes<HTMLButtonElement> {
  value: string | number;
  selected?: boolean;
  flipped?: boolean; // For showing result
  disabled?: boolean;
  onClick?: () => void;
}

export function PokerCard({
  value,
  selected,
  flipped,
  disabled,
  className,
  onClick,
  ...props
}: PokerCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex h-32 w-24 items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md -translate-y-2"
          : "border-slate-200 bg-white text-slate-900 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-sm",
        flipped && "bg-slate-900 text-white border-slate-900", // Back of card or flipped state style
        className
      )}
      {...props}
    >
      <span className={cn("text-3xl font-bold", flipped && "hidden")}>
        {value}
      </span>
      {flipped && (
        // Placeholder pattern for back of card
        <div className="absolute inset-2 rounded-lg border border-dashed border-slate-700 opacity-20" />
      )}
    </button>
  );
}
