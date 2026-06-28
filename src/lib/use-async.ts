// Tiny async-state hook for the dashboard sections.
//
// Each section calls the typed data service (lib/api.ts) and renders one of four
// states: idle / loading / success / error. Fetching happens only on the client
// (inside useEffect) so SSR never tries to reach the engine. `manual` mode defers
// the call until `run()` is invoked (used by the "Esegui" button).

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function toMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export interface UseAsyncResult<T> {
  state: AsyncState<T>;
  run: () => void;
  reset: () => void;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
  opts: { manual?: boolean } = {},
): UseAsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const reqId = useRef(0);

  const run = useCallback(() => {
    const id = ++reqId.current;
    setState({ status: "loading" });
    fnRef
      .current()
      .then((data) => {
        if (id === reqId.current) setState({ status: "success", data });
      })
      .catch((err) => {
        if (id === reqId.current) setState({ status: "error", error: toMessage(err) });
      });
  }, []);

  const reset = useCallback(() => {
    reqId.current++;
    setState({ status: "idle" });
  }, []);

  useEffect(() => {
    if (opts.manual) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { state, run, reset };
}
