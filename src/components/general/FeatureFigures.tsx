import Image from "next/image";
import { cn } from "@/lib/utils/helpers";

// Images and overlays for the landing page features. Each figure lays out its
// parts in the same 300 x 280 units so the three line up side by side.

// Overlay for the lines and labels drawn on top of the images
const svgProps = {
    viewBox: "0 0 300 280",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
};

const dim = "text-muted-foreground/45";
const lit = "text-foreground";

type WeaponProps = {
    // Tailwind class naming the silhouette, e.g. "mask-[url(/weapons/x.svg)]"
    mask: string;
    x: number;
    y: number;
    width: number;
    ratio: number;
    className: string;
};

// A weapon silhouette from public/weapons, placed in the same 300 x 280 units
// as the other figures. It is drawn as a mask so it takes the text color.
function Weapon({ mask, x, y, width, ratio, className }: WeaponProps) {
    return (
        <div
            className={`absolute bg-current mask-contain mask-center mask-no-repeat ${mask} ${className}`}
            style={{
                left: `${(x / 300) * 100}%`,
                top: `${(y / 280) * 100}%`,
                width: `${(width / 300) * 100}%`,
                aspectRatio: ratio,
            }}
        />
    );
}

const reel: WeaponProps[] = [
    {
        mask: "mask-[url(/weapons/cbj-ms.svg)]",
        x: 102,
        y: 14,
        width: 96,
        ratio: 624 / 405,
        className: dim,
    },
    {
        mask: "mask-[url(/weapons/sfp9.svg)]",
        x: 102.5,
        y: 96,
        width: 95,
        ratio: 594 / 487,
        className: lit,
    },
    {
        mask: "mask-[url(/weapons/m1014.svg)]",
        x: 35,
        y: 202,
        width: 230,
        ratio: 1479 / 292,
        className: dim,
    },
];

// A reel of weapons stopped on the pistol
export function RandomFigure() {
    return (
        <div
            role="img"
            aria-label="A column of weapons with the pistol in the middle selected"
            className="relative aspect-300/280 w-full max-w-80"
        >
            {reel.map((weapon) => (
                <Weapon key={weapon.mask} {...weapon} />
            ))}
            <svg
                {...svgProps}
                aria-hidden
                className="absolute inset-0 size-full"
            >
                <path
                    d="M8 102 V90 H20 M280 90 H292 V102 M8 168 V180 H20 M280 180 H292 V168"
                    fill="none"
                    strokeWidth={1.5}
                    className={lit}
                />
            </svg>
        </div>
    );
}

// Leader lines run from each label to where that attachment mounts on the
// SCAR drawn below: the rear sight, the muzzle and the underside of the rail.
// Each stops 3 units short of the gun so it doesn't touch the silhouette.
const callouts = [
    {
        label: "Sight",
        x: 126,
        y: 62,
        anchor: "start",
        line: "M128 67 L111.9 112.4",
    },
    {
        label: "Barrel",
        x: 296,
        y: 92,
        anchor: "end",
        line: "M283 97 L268.4 136.3",
    },
    {
        label: "Grip",
        x: 212,
        y: 244,
        anchor: "start",
        line: "M214 233 L194.9 157.5",
    },
    {
        label: "Underbarrel",
        x: 296,
        y: 214,
        anchor: "end",
        line: "M238 203 L228.8 157.1",
    },
] as const;

// A rifle with its four attachment slots called out
export function CustomFigure() {
    return (
        <div
            role="img"
            aria-label="A rifle with lines pointing to its sight, barrel, grip and underbarrel slots"
            className="relative aspect-300/280 w-full max-w-80"
        >
            <Weapon
                mask="mask-[url(/weapons/scar-sc.svg)]"
                x={20}
                y={110}
                width={260}
                ratio={1306 / 508}
                className={lit}
            />
            <svg
                {...svgProps}
                aria-hidden
                className="absolute inset-0 size-full text-muted-foreground"
            >
                {callouts.map(({ label, x, y, anchor, line }) => (
                    <g key={label}>
                        <path d={line} />
                        <text
                            x={x}
                            y={y}
                            textAnchor={anchor}
                            fontSize={11}
                            fill="currentColor"
                            stroke="none"
                        >
                            {label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

// Full body renders cropped to the top `torso` of each image. `size` is the
// height the whole image would be drawn at, in the same 300 x 280 units.
const torso = 0.45;
const squad = [
    {
        src: "/figures/ash_full_body.png",
        width: 1200,
        height: 3461,
        x: -6,
        y: 86,
        size: 430,
        front: false,
    },
    {
        src: "/figures/solid_snake_full_body.png",
        width: 1000,
        height: 1806,
        x: 96,
        y: 86,
        size: 430,
        front: false,
    },
    {
        src: "/figures/sledge_full_body.png",
        width: 1913,
        height: 3892,
        x: 4,
        y: 60,
        size: 490,
        front: true,
    },
];

// A squad of three operators that puts the one in front forward on hover
export function ChallengeFigure() {
    return (
        <div
            role="img"
            aria-label="Ash, Sledge and Solid Snake lined up as a squad"
            // Clip the sides and bottom but leave room above for the hover pop
            className="relative aspect-300/280 w-full max-w-80 [clip-path:inset(-50%_0_0_0)]"
        >
            {squad.map(({ src, width, height, x, y, size, front }) => {
                const boxWidth = (width / height) * size;
                return (
                    <div
                        key={src}
                        className={cn(
                            "absolute origin-bottom overflow-hidden mask-b-from-75% transition duration-300 motion-reduce:transition-none",
                            // Reacts to hovering the surrounding feature card (`group`)
                            front
                                ? "group-hover:scale-112"
                                : "group-hover:scale-95 group-hover:opacity-50"
                        )}
                        style={{
                            left: `${(x / 300) * 100}%`,
                            top: `${(y / 280) * 100}%`,
                            width: `${(boxWidth / 300) * 100}%`,
                            height: `${((size * torso) / 280) * 100}%`,
                        }}
                    >
                        <Image
                            src={src}
                            alt=""
                            width={width}
                            height={height}
                            sizes={`${Math.ceil((boxWidth / 300) * 320)}px`}
                            className="h-auto w-full"
                        />
                    </div>
                );
            })}
        </div>
    );
}
