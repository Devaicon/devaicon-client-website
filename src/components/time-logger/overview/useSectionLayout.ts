"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_LAYOUT,
  getLayout,
  getServerLayout,
  hide,
  layoutsEqual,
  move,
  setWidth,
  show,
  subscribeLayout,
  writeLayout,
  type Scope,
  type SectionId,
  type SectionLayout,
  type SectionWidth,
} from "./sections";

export type SectionLayoutApi = {
  layout: SectionLayout;
  moveSection: (from: number, to: number) => void;
  hideSection: (id: SectionId) => void;
  showSection: (id: SectionId) => void;
  setSectionWidth: (id: SectionId, width: SectionWidth) => void;
  reset: () => void;
  /** True once the layout differs from the one the page ships with. */
  customised: boolean;
};

export function useSectionLayout(scope: Scope): SectionLayoutApi {
  const subscribe = useCallback(
    (cb: () => void) => subscribeLayout(scope, cb),
    [scope],
  );
  const layout = useSyncExternalStore(
    subscribe,
    useCallback(() => getLayout(scope), [scope]),
    getServerLayout,
  );

  // Every mutation reads the store fresh rather than closing over `layout`, so
  // two changes in the same tick cannot drop the first one.
  const apply = useCallback(
    (fn: (current: SectionLayout) => SectionLayout) =>
      writeLayout(scope, fn(getLayout(scope))),
    [scope],
  );

  return {
    layout,
    moveSection: (from, to) => apply((l) => move(l, from, to)),
    hideSection: (id) => apply((l) => hide(l, id)),
    showSection: (id) => apply((l) => show(l, id)),
    setSectionWidth: (id, width) => apply((l) => setWidth(l, id, width)),
    reset: () => writeLayout(scope, DEFAULT_LAYOUT),
    customised: !layoutsEqual(layout, DEFAULT_LAYOUT),
  };
}
