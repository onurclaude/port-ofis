"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";

type Status = "loading" | "success" | "error";

/**
 * Fetches admin list/detail data keyed by an arbitrary string (token +
 * filters + pagination, joined). Re-fetches whenever `key` changes, flips
 * back to "loading" during render (not inside the effect) so the loading
 * state is visible immediately, and routes any 401 to `onUnauthorized`
 * (the cross-cutting session-expiry behavior in FRONTEND_SPEC §7.6).
 */
export function useAdminQuery<T>(
  enabled: boolean,
  fetcher: () => Promise<T>,
  key: string,
  onUnauthorized: () => void,
) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const [lastKey, setLastKey] = useState(key);
  if (lastKey !== key) {
    setLastKey(key);
    setStatus("loading");
  }

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    fetcher()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          onUnauthorized();
          return;
        }
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // `fetcher`/`onUnauthorized` intentionally excluded: `key` is the
    // canonical dependency representing everything the fetch depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return { data, status, setData };
}
