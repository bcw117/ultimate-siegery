import { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description?: string;
    children?: ReactNode;
};

// Title row shared by every signed-in page; `children` holds page actions
export default function PageHeader({
    title,
    description,
    children,
}: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                <h1 className="text-4xl leading-none font-bold font-display md:text-5xl">
                    {title}
                </h1>
                {description && (
                    <p className="max-w-prose text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </header>
    );
}
