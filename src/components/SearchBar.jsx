import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPES } from "../data/config";
import { useSuburbSuggestions } from "../hooks/useProperties";

export default function SearchBar({ filters, onFiltersChange, onSearch, onTogglePanel }) {
  const [suburbInput, setSuburbInput] = useState(filters.suburb || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, lookup, clear } = useSuburbSuggestions();
  const suggRef = useRef(null);

  const update = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Suburb autocomplete
  useEffect(() => {
    const t = setTimeout(() => {
      lookup(suburbInput, filters.state || "VIC");
      setShowSuggestions(suburbInput.length >= 2);
    }, 250);
    return () => clearTimeout(t);
  }, [suburbInput, filters.state, lookup]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggRef.current && !suggRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSuburb = (s) => {
    setSuburbInput(s.suburb);
    onFiltersChange({ ...filters, suburb: s.suburb, state: s.state || "VIC" });
    setShowSuggestions(false);
    clear();
  };

  const clearSuburb = () => {
    setSuburbInput("");
    onFiltersChange({ ...filters, suburb: "", state: "VIC" });
    clear();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const nextFilters = {
      ...filters,
      suburb: suburbInput || "",
    };
    // If user typed something without selecting a suggestion, use it as-is
    if (suburbInput !== filters.suburb) {
      onFiltersChange(nextFilters);
    }
    onSearch(nextFilters);
    setShowSuggestions(false);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      {/* Suburb input with autocomplete */}
      <div className="suburb-wrap" ref={suggRef}>
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Suburb or postcode..."
            value={suburbInput}
            onChange={(e) => setSuburbInput(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
          {suburbInput && (
            <button type="button" className="clear-btn" onClick={clearSuburb}>
              <X size={14} />
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li key={i} onMouseDown={() => selectSuburb(s)} className="suggestion-item">
                {s.display}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* State */}
      <select
        value={filters.state || "VIC"}
        onChange={(e) => update("state", e.target.value)}
        className="search-select"
      >
        <option value="VIC">VIC</option>
        <option value="NSW">NSW</option>
        <option value="QLD">QLD</option>
        <option value="SA">SA</option>
        <option value="WA">WA</option>
        <option value="TAS">TAS</option>
        <option value="ACT">ACT</option>
        <option value="NT">NT</option>
      </select>

      {/* Property type */}
      <select
        value={filters.propertyType || "All"}
        onChange={(e) => update("propertyType", e.target.value)}
        className="search-select"
      >
        {PROPERTY_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Listing type */}
      <select
        value={filters.listingType || "Sale"}
        onChange={(e) => update("listingType", e.target.value)}
        className="search-select"
      >
        <option value="Sale">For Sale</option>
        <option value="Rent">For Rent</option>
      </select>

      {/* Min beds */}
      <select
        value={filters.minBeds || "0"}
        onChange={(e) => update("minBeds", Number(e.target.value))}
        className="search-select"
      >
        <option value="0">Any beds</option>
        <option value="1">1+ bed</option>
        <option value="2">2+ beds</option>
        <option value="3">3+ beds</option>
        <option value="4">4+ beds</option>
      </select>

      <button type="submit" className="search-submit-btn">
        Search
      </button>

      <button type="button" className="ranking-toggle-btn" onClick={onTogglePanel}>
        <SlidersHorizontal size={15} />
        Rank Criteria
      </button>
    </form>
  );
}
