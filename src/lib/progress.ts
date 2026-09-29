/**
 * What the page-load bar at the top of the window is waiting for.
 *
 * Anything that makes the reader wait for a page — a navigation, or the data
 * a dashboard page fetches when it opens — calls `startProgress()` and calls
 * the function it gets back when it is done. The bar shows while at least one
 * is outstanding. Saves and other background writes don't take part: the bar
 * means "this page is still loading", not "something is happening".
 */

let pending = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function startProgress(): () => void {
  pending += 1;
  emit();
  let finished = false;
  return () => {
    if (finished) return;
    finished = true;
    pending = Math.max(0, pending - 1);
    emit();
  };
}

export function subscribeProgress(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function isLoading(): boolean {
  return pending > 0;
}
