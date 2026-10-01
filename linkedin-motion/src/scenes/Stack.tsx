import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Badge, badgeMetrics } from "../components/Badge";
import { DrawPath } from "../components/DrawLine";
import { SceneHeader } from "../components/SceneHeader";
import { sections, stackRows } from "../data";
import { useLayout } from "../layout";
import { colors, motion } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Node = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
  order: number;
};

/** Coupe les rangées trop larges pour l'écran. */
const fitRows = (rows: string[][], maxWidth: number, gap: number) => {
  const out: string[][] = [];
  for (const row of rows) {
    let current: string[] = [];
    let width = 0;
    for (const label of row) {
      const w = badgeMetrics(label).width;
      const next = current.length ? width + gap + w : w;
      if (current.length && next > maxWidth) {
        out.push(current);
        current = [label];
        width = w;
      } else {
        current.push(label);
        width = next;
      }
    }
    if (current.length) {
      out.push(current);
    }
  }
  return out;
};

const bezierPoint = (
  [x0, y0]: [number, number],
  [x1, y1]: [number, number],
  t: number,
): [number, number] => {
  // Courbe en S verticale : points de contrôle à mi-hauteur.
  const ym = (y0 + y1) / 2;
  const u = 1 - t;
  const x = u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1;
  const y = u * u * u * y0 + 3 * u * u * t * ym + 3 * u * t * t * ym + t * t * t * y1;
  return [x, y];
};

export const Stack: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const gapX = 24;
  const rowGap = L.pick(86, 56);
  const width = L.contentWidth;
  const rows = fitRows(stackRows, width, gapX);
  const badgeH = badgeMetrics("x").height;
  const height = rows.length * badgeH + (rows.length - 1) * rowGap;

  // Position de chaque badge (rangées centrées).
  const nodes: Node[] = [];
  rows.forEach((row, r) => {
    const widths = row.map((label) => badgeMetrics(label).width);
    const rowWidth = widths.reduce((a, b) => a + b, 0) + gapX * (row.length - 1);
    let x = (width - rowWidth) / 2;
    row.forEach((label, i) => {
      nodes.push({
        label,
        x,
        y: r * (badgeH + rowGap),
        w: widths[i],
        h: badgeH,
        row: r,
        order: nodes.length,
      });
      x += widths[i] + gapX;
    });
  });

  // Arêtes du « DAG » : chaque badge est relié au(x) parent(s) le(s) plus proche(s).
  const cx = (n: Node) => n.x + n.w / 2;
  const edges: Array<[Node, Node]> = [];
  for (let r = 0; r < rows.length - 1; r++) {
    const parents = nodes.filter((n) => n.row === r);
    const children = nodes.filter((n) => n.row === r + 1);
    const linked = new Set<Node>();
    for (const child of children) {
      const sorted = [...parents].sort(
        (a, b) => Math.abs(cx(a) - cx(child)) - Math.abs(cx(b) - cx(child)),
      );
      edges.push([sorted[0], child]);
      linked.add(sorted[0]);
      if (sorted[1] && Math.abs(cx(sorted[1]) - cx(child)) < 300) {
        edges.push([sorted[1], child]);
        linked.add(sorted[1]);
      }
    }
    for (const parent of parents) {
      if (!linked.has(parent)) {
        const nearest = [...children].sort(
          (a, b) => Math.abs(cx(a) - cx(parent)) - Math.abs(cx(b) - cx(parent)),
        )[0];
        edges.push([parent, nearest]);
      }
    }
  }

  const appearAt = (n: Node) => 6 + n.order * motion.stagger;

  return (
    <AbsoluteFill
      style={{
        padding: L.margin,
        justifyContent: "center",
        gap: L.pick(80, 48),
      }}
    >
      <SceneHeader title={sections.stack.title} start={4} />
      <div style={{ position: "relative", width, height }}>
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {edges.map(([p, c]) => {
            const from: [number, number] = [cx(p), p.y + p.h];
            const to: [number, number] = [cx(c), c.y];
            const ym = (from[1] + to[1]) / 2;
            const start = Math.max(appearAt(p) + 2, appearAt(c) - 6);
            const drawn = interpolate(frame, [start, start + 8], [0, 1], clamp);
            // Petit paquet de données qui circule une fois l'arête tracée.
            const cycle = 30;
            const phase = ((frame - start - 8 + p.order * 7 + c.order * 5) % cycle) / cycle;
            const [px, py] = bezierPoint(from, to, phase);
            const packetOpacity =
              frame > start + 8 ? Math.sin(phase * Math.PI) * 0.95 : 0;
            return (
              <g key={`${p.label}-${c.label}`}>
                <DrawPath
                  d={`M ${from[0]} ${from[1]} C ${from[0]} ${ym} ${to[0]} ${ym} ${to[0]} ${to[1]}`}
                  progress={drawn}
                  color={colors.creamFaint}
                  width={2}
                />
                <circle cx={px} cy={py} r={5} fill={colors.amber} opacity={packetOpacity} />
              </g>
            );
          })}
        </svg>
        {nodes.map((n) => (
          <Badge
            key={n.label}
            label={n.label}
            appearAt={appearAt(n)}
            typed
            style={{ position: "absolute", left: n.x, top: n.y }}
          />
        ))}
        {/* Ports d'entrée / sortie des nœuds, au-dessus des badges */}
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {nodes.map((n) => {
            const o = interpolate(frame, [appearAt(n) + 2, appearAt(n) + 8], [0, 1], clamp);
            return (
              <g key={`port-${n.label}`} opacity={o}>
                {n.row > 0 ? (
                  <circle cx={cx(n)} cy={n.y} r={5} fill={colors.bg} stroke={colors.sage} strokeWidth={2} />
                ) : null}
                {n.row < rows.length - 1 ? (
                  <circle cx={cx(n)} cy={n.y + n.h} r={5} fill={colors.amber} />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
