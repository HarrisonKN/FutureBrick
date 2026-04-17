import { useState, useCallback } from "react";
import { API_BASE } from "../data/config";
import { LIVE_RESULTS_PAGE_SIZE } from "../data/spreadsheet";

/**
 * useProperties — fetches listings from the local Express server
 * which proxies the Domain API.
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const search = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.suburb && filters.suburb !== "All") params.set("suburb", filters.suburb);
    if (filters.state) params.set("state", filters.state);
    if (filters.propertyType && filters.propertyType !== "All") params.set("type", filters.propertyType);
    if (filters.minBeds) params.set("minBeds", filters.minBeds);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.listingType) params.set("listingType", filters.listingType);
    params.set("pageSize", filters.pageSize || LIVE_RESULTS_PAGE_SIZE);
    params.set("pageNumber", filters.pageNumber || 1);

    try {
      const res = await fetch(`${API_BASE}/api/properties?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { properties, loading, error, total, search };
}

/**
 * useSuburbSuggestions — autocomplete suburbs via Domain API
 */
export function useSuburbSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  const lookup = useCallback(async (q, state = "VIC") => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`${API_BASE}/api/suburbs?q=${encodeURIComponent(q)}&state=${state}`);
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, lookup, clear };
}
