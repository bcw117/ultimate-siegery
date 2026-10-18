import { ReactNode } from "react";

// Isometric line drawings for the landing page features. Shapes are
// described in flat (x, y, z) units and projected at 30 degrees.
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

type Origin = { ox: number; oy: number };
type Point = [number, number];

function project(x: number, y: number, z: number, { ox, oy }: Origin): Point {
  return [ox + (x - y) * COS, oy + (x + y) * SIN - z];
}

function points(pts: Point[]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

const faceProps = {
  fill: "var(--background)",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

type PlateProps = {
  origin: Origin;
  x?: number;
  y?: number;
  size: number;
  z: number;
  thickness: number;
  className?: string;
  // Drawn flat in plate coordinates (0..size) and projected onto the top face
  children?: ReactNode;
};

function Plate({
  origin,
  x = 0,
  y = 0,
  size,
  z,
  thickness,
  className,
  children,
}: PlateProps) {
  const top = z + thickness;
  const p = (px: number, py: number, pz: number) =>
    project(x + px, y + py, pz, origin);
  const [tx, ty] = p(0, 0, top);

  return (
    <g className={className}>
      <polygon
        {...faceProps}
        points={points([
          p(size, 0, top),
          p(size, size, top),
          p(size, size, z),
          p(size, 0, z),
        ])}
      />
      <polygon
        {...faceProps}
        points={points([
          p(0, size, top),
          p(size, size, top),
          p(size, size, z),
          p(0, size, z),
        ])}
      />
      <polygon
        {...faceProps}
        points={points([
          p(0, 0, top),
          p(size, 0, top),
          p(size, size, top),
          p(0, size, top),
        ])}
      />
      {children && (
        <g transform={`matrix(${COS} ${SIN} ${-COS} ${SIN} ${tx} ${ty})`}>
          {children}
        </g>
      )}
    </g>
  );
}

const svgProps = {
  viewBox: "0 0 300 280",
  role: "img",
  className: "h-auto w-full max-w-80",
};

const dim = "text-muted-foreground/45";
const lit = "text-foreground";

// A stack of loadouts with the top one rolled off like a die
export function RandomFigure() {
  const origin = { ox: 150, oy: 130 };
  const size = 120;
  const pips: Point[] = [
    [32, 32],
    [88, 32],
    [60, 60],
    [32, 88],
    [88, 88],
  ];
  const liftedZ = 92;
  const guide = (px: number, py: number) => {
    const [x1, y1] = project(px, py, 56, origin);
    const [, y2] = project(px, py, liftedZ, origin);
    return (
      <line
        key={`${px}-${py}`}
        x1={x1}
        y1={y1}
        x2={x1}
        y2={y2}
        stroke="currentColor"
        strokeDasharray="2 4"
        className={dim}
      />
    );
  };

  return (
    <svg {...svgProps} aria-label="A stack of plates with the top plate lifted">
      {[0, 16, 32, 48].map((z) => (
        <Plate
          key={z}
          origin={origin}
          size={size}
          z={z}
          thickness={8}
          className={dim}
        />
      ))}
      {guide(size, 0)}
      {guide(size, size)}
      {guide(0, size)}
      <Plate
        origin={origin}
        size={size}
        z={liftedZ}
        thickness={8}
        className={lit}
      >
        {pips.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={8}
            fill="currentColor"
          />
        ))}
      </Plate>
    </svg>
  );
}

// A weapon pulled apart into its four attachment slots
export function CustomFigure() {
  const origin = { ox: 118, oy: 162 };
  const size = 100;
  const layers = [
    { label: "Underbarrel", z: 0 },
    { label: "Grip", z: 46 },
    { label: "Barrel", z: 92 },
    { label: "Sight", z: 138 },
  ];

  return (
    <svg
      {...svgProps}
      aria-label="Four plates labelled underbarrel, grip, barrel and sight"
    >
      {layers.map(({ label, z }, i) => {
        const isSight = i === layers.length - 1;
        const [ax, ay] = project(size, 0, z + 6, origin);
        return (
          <g key={label}>
            <Plate
              origin={origin}
              size={size}
              z={z}
              thickness={6}
              className={isSight ? lit : dim}
            >
              {isSight && (
                <g
                  fill="none"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                >
                  <circle
                    cx={50}
                    cy={50}
                    r={26}
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx={50} cy={50} r={3} fill="currentColor" />
                  <line
                    x1={50}
                    y1={14}
                    x2={50}
                    y2={36}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={50}
                    y1={64}
                    x2={50}
                    y2={86}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={14}
                    y1={50}
                    x2={36}
                    y2={50}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={64}
                    y1={50}
                    x2={86}
                    y2={50}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )}
            </Plate>
            <line
              x1={ax + 6}
              y1={ay}
              x2={ax + 22}
              y2={ay}
              stroke="currentColor"
              strokeDasharray="2 3"
              className={dim}
            />
            <text
              x={ax + 26}
              y={ay + 3.5}
              fontSize={11}
              fill="currentColor"
              className={isSight ? lit : "text-muted-foreground"}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// A board of house rules with one raised out of the grid
export function ChallengeFigure() {
  const origin = { ox: 122, oy: 66 };
  const tile = 24;
  const gap = 8;
  const raised = { col: 3, row: 2 };
  const at = (n: number) => n * (tile + gap);
  // Back to front, so nearer tiles cover the ones behind them
  const tiles = Array.from({ length: 24 }, (_, i) => ({
    col: i % 6,
    row: Math.floor(i / 6),
  }))
    .filter(({ col, row }) => col !== raised.col || row !== raised.row)
    .sort((a, b) => a.col + a.row - (b.col + b.row));
  const [rx, ry] = [at(raised.col), at(raised.row)];
  const hole = [
    project(rx, ry, 0, origin),
    project(rx + tile, ry, 0, origin),
    project(rx + tile, ry + tile, 0, origin),
    project(rx, ry + tile, 0, origin),
  ];

  return (
    <svg {...svgProps} aria-label="A grid of 24 tiles with one tile raised">
      {tiles.map(({ col, row }) => (
        <Plate
          key={`${col}-${row}`}
          origin={origin}
          x={at(col)}
          y={at(row)}
          size={tile}
          z={0}
          thickness={5}
          className={dim}
        />
      ))}
      <polygon
        points={points(hole)}
        fill="none"
        stroke="currentColor"
        strokeDasharray="2 3"
        className={dim}
      />
      <Plate
        origin={origin}
        x={rx}
        y={ry}
        size={tile}
        z={48}
        thickness={5}
        className={lit}
      />
    </svg>
  );
}
