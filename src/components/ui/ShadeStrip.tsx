import React from 'react';

interface ShadeStripProps {
  /** Route length in kilometres. */
  distanceKm: number;
  /** Share of the route that is shaded, 0 to 100. */
  shadePercent: number;
  /** Tick height in pixels. */
  height?: number;
  /** Stagger the ticks in once on mount. */
  animate?: boolean;
  className?: string;
}

const METRES_PER_TICK = 25;

/**
 * A route drawn as a strip of ticks. Each tick is 25 m of walking:
 * green where the walker is in shade, orange where they are in sun.
 * Shaded ticks come first, so this reads as a quantity, not a map of
 * where the shade falls along the route.
 */
export const ShadeStrip: React.FC<ShadeStripProps> = ({
  distanceKm,
  shadePercent,
  height = 22,
  animate = false,
  className = ''
}) => {
  const total = Math.max(4, Math.round((distanceKm * 1000) / METRES_PER_TICK));
  const shaded = Math.round((total * Math.min(100, Math.max(0, shadePercent))) / 100);
  const sunMetres = Math.round(((total - shaded) * METRES_PER_TICK) / 5) * 5;
  const shadeMetres = Math.round((shaded * METRES_PER_TICK) / 5) * 5;

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`${shadePercent}% of the ${distanceKm} km route is in shade`}
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`, height }}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="shade-tick block origin-bottom"
            style={{
              background: i < shaded ? 'var(--color-canopy)' : 'var(--color-laterite)',
              animation: animate
                ? `tick-in 320ms ease-out ${Math.min(i * 7, 600)}ms both`
                : undefined
            }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-4 text-[13px] text-ink-2 num">
        <span>
          <span className="inline-block w-2 h-2 mr-1.5 bg-canopy align-baseline" />
          {shadeMetres} m in shade
        </span>
        <span>
          <span className="inline-block w-2 h-2 mr-1.5 bg-laterite align-baseline" />
          {sunMetres} m in sun
        </span>
      </div>
    </div>
  );
};
