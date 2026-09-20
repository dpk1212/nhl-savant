import { useCallback, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  UNIT_DISPLAY_SCALE,
  normalizeUnitDisplayScale,
  readStoredUnitDisplayScale,
  writeStoredUnitDisplayScale,
} from '../lib/unitDisplayScale.js';
import { onesignalApplyUnitDisplayScale } from '../lib/onesignal';

/**
 * Full vs Conservative unit book.
 * Local cache paints immediately; Firestore `users/{uid}.unitDisplayScale` is the save.
 */
export function useUnitDisplayScale(user) {
  const [scale, setScale] = useState(readStoredUnitDisplayScale);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (!snap.exists()) return;
      const next = normalizeUnitDisplayScale(snap.data().unitDisplayScale);
      writeStoredUnitDisplayScale(next);
      setScale(next);
    }, (err) => {
      console.warn('unitDisplayScale listen failed:', err?.message || err);
    });
    return unsub;
  }, [user?.uid]);

  const setUnitDisplayScale = useCallback(async (next) => {
    const normalized = normalizeUnitDisplayScale(next);
    setScale(normalized);
    writeStoredUnitDisplayScale(normalized);
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        unitDisplayScale: normalized,
      }, { merge: true });
      try {
        await onesignalApplyUnitDisplayScale(normalized);
      } catch (err) {
        console.warn('OneSignal unit-scale tag sync failed:', err?.message || err);
      }
    } catch (err) {
      console.error('Failed to save unit display scale:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user?.uid]);

  return {
    scale,
    setUnitDisplayScale,
    saving,
    isConservative: scale === UNIT_DISPLAY_SCALE.CONSERVATIVE,
  };
}
