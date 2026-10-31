import { useEffect, useRef, useState } from 'react';

const RESERVE = 520;

/**
 * Phone lists. The locked-picks column mounts every card, and iOS dies
 * when the no-play tail at the bottom is built on top of the cards
 * already scrolled past. Keep the row's height, render the card only
 * while it is near the screen.
 */
export default function MobileViewportSlot({ enabled, children }) {
  const ref = useRef(null);
  const reserve = useRef(RESERVE);
  const [live, setLive] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setLive(true);
      return undefined;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLive(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLive(true);
        return;
      }
      const h = el.getBoundingClientRect().height;
      if (h > 120) reserve.current = h;
      setLive(false);
    }, { rootMargin: '240px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return children;
  return (
    <div ref={ref} style={live ? undefined : { height: reserve.current }}>
      {live ? children : null}
    </div>
  );
}
