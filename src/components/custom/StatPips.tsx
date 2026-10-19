import { cn } from "@/lib/utils/helpers";

type StatPipsProps = { label: string; value: number; max?: number };

// Operator health and speed are rated 1 to 3, shown as pips like in game
export default function StatPips({ label, value, max = 3 }: StatPipsProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="flex gap-1">
                {Array.from({ length: max }, (_, i) => (
                    <span
                        key={i}
                        aria-hidden
                        className={cn(
                            "h-2 w-6 rounded-sm",
                            i < value ? "bg-foreground" : "bg-muted"
                        )}
                    />
                ))}
                <span className="sr-only">
                    {value} of {max}
                </span>
            </dd>
        </div>
    );
}
