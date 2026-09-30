function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Low-vig books stay off the shop rail and off the T-15 lock. */
export function shopRailHidden(name) {
  const k = shopBookKey(name);
  return k === 'lowvig' || k === 'lv' || k.includes('lowvig');
}
