"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SearchServer } from "@/lib/search";

interface SearchIndexValue {
  servers: SearchServer[];
  ensureLoaded: () => void;
}

const EMPTY_SEARCH_INDEX: SearchIndexValue = {
  servers: [],
  ensureLoaded: () => undefined,
};

const SearchIndexContext = createContext<SearchIndexValue>(EMPTY_SEARCH_INDEX);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<SearchServer[]>([]);
  const loadingRef = useRef(false);

  const ensureLoaded = useCallback(() => {
    if (loadingRef.current || servers.length > 0) return;
    loadingRef.current = true;
    void fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json() as Promise<{ servers: SearchServer[] }>;
      })
      .then((payload) => setServers(payload.servers))
      .catch(() => {
        loadingRef.current = false;
      });
  }, [servers.length]);

  return (
    <SearchIndexContext.Provider value={{ servers, ensureLoaded }}>
      {children}
    </SearchIndexContext.Provider>
  );
}

export function useSearchServers(): SearchIndexValue {
  return useContext(SearchIndexContext);
}
