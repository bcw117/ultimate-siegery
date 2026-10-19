import { ReactNode } from "react";

type Stat = { label: string; value: ReactNode };

export default function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
            {stats.map(({ value, label }) => (
                <div
                    key={label}
                    className="flex min-w-0 flex-col-reverse gap-1 bg-background p-5 max-md:odd:last:col-span-2 md:p-6"
                >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="truncate text-5xl leading-none font-semibold font-display tabular-nums">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
