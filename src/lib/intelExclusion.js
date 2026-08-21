/**
 * MM/trader exclusion vs force-include (directional wallets falsely tagged).
 * writeSharpActions already subtracts force-include. Sharp Flow UI must
 * use the same set or Action tickets vanish from locked cards.
 */

export function forceIncludeAddrs(forceDoc) {
  return (Array.isArray(forceDoc?.wallets) ? forceDoc.wallets : [])
    .map((w) => String(w?.addr || w || '').toLowerCase())
    .filter(Boolean);
}

/** Excluded addresses after force-include wins. Null when the list is empty. */
export function buildIntelExcludedSet(excludedDoc, forceDoc) {
  const force = new Set(forceIncludeAddrs(forceDoc));
  const xs = Array.isArray(excludedDoc?.excluded) ? excludedDoc.excluded : [];
  const set = new Set(
    xs.map((a) => String(a || '').toLowerCase()).filter((a) => a && !force.has(a)),
  );
  return set.size ? set : null;
}
