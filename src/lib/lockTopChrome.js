import { useSyncExternalStore } from 'react';

const EMPTY = { mode: '', pnl: '', rec: '' };
let snap = EMPTY;
const listeners = new Set();

function commit(next) {
  if (next.mode === snap.mode && next.pnl === snap.pnl && next.rec === snap.rec) return;
  snap = next;
  const root = document.documentElement;
  if (next.mode) root.dataset.locktop = next.mode;
  else delete root.dataset.locktop;
  listeners.forEach((fn) => fn());
}

export function setLockChrome(partial) {
  commit({ ...snap, ...partial });
}

export function clearLockChrome() {
  commit(EMPTY);
  document.documentElement.style.removeProperty('--sf-lock-p');
}

export function useLockChrome() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => snap,
    () => EMPTY,
  );
}
