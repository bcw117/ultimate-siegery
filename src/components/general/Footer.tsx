import Link from "next/link";

const linkClass =
    "rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

const Footer = () => {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground font-display">
                        Ultimate Siegery
                    </p>
                    <p>Not affiliated with Ubisoft or Rainbow Six Siege.</p>
                    <p>
                        © {new Date().getFullYear()} Ultimate Siegery. Made by
                        Boris Wang.
                    </p>
                </div>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    <li>
                        <Link href="/terms" className={linkClass}>
                            Terms and conditions
                        </Link>
                    </li>
                    <li>
                        <Link href="/privacy" className={linkClass}>
                            Privacy policy
                        </Link>
                    </li>
                    <li>
                        <a
                            href="https://beacons.ai/boriscodes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            Support the developer
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
