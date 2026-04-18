import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { ArrowUpDown, Palette, WandSparkles } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ScoringSheet from "./components/ScoringSheet";
import InsightsPage from "./components/InsightsPage";
import { useProperties } from "./hooks/useProperties";
import {
  LIVE_RESULTS_PAGE_SIZE,
  SAMPLE_SHEET_ROWS,
  SHEET_CRITERIA,
  attachTotals,
  buildLiveSheetRowsWithCriteria,
  clampScore,
  createCustomCriterion,
  createEmptyRow,
  withAllScores,
} from "./data/spreadsheet";
import "./App.css";

/* ── constants ── */
const DEFAULT_FILTERS = { state: "VIC", listingType: "Sale", pageSize: LIVE_RESULTS_PAGE_SIZE };
const INITIAL_CRITERIA = SHEET_CRITERIA.map((c) => ({ ...c, weight: c.defaultWeight }));
const PAGES = [
  { to: "/",         label: "Sheet" },
  { to: "/search",   label: "Search" },
  { to: "/insights", label: "Insights" },
];

const PALETTES = [
  { id: "warm", label: "Warm Sand" },
  { id: "serene", label: "Ocean Calm" },
  { id: "slate", label: "Soft Slate" },
  { id: "aurora", label: "Aurora Glow" },
  { id: "midnight", label: "Midnight Neon" },
  { id: "cyberlime", label: "Cyber Lime" },
  { id: "cherrynoir", label: "Cherry Noir" },
  { id: "ultraviolet", label: "Ultraviolet Pop" },
  { id: "sunset", label: "Sunset Punch" },
];
const PALETTE_STORAGE_KEY = "futurebrick-palette";

const STATIC_SORT_OPTIONS = [
  { key: "address", label: "Address" },
  { key: "price", label: "Price" },
  { key: "dateInspected", label: "Inspected" },
  { key: "bedrooms", label: "Bed" },
  { key: "bathrooms", label: "Bath" },
  { key: "toilets", label: "WC" },
  { key: "total", label: "Total" },
];

function getSortValue(row, sortKey) {
  if (sortKey === "total") return Number(row.total ?? 0);
  if (Object.prototype.hasOwnProperty.call(row, sortKey)) return row[sortKey];
  if (row.scores && Object.prototype.hasOwnProperty.call(row.scores, sortKey)) return row.scores[sortKey];
  return "";
}

function sortRows(rows, sortKey, direction) {
  const sorted = [...rows].sort((left, right) => {
    const leftValue = getSortValue(left, sortKey);
    const rightValue = getSortValue(right, sortKey);

    if (typeof leftValue === "string" || typeof rightValue === "string") {
      return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, { numeric: true, sensitivity: "base" });
    }

    return Number(leftValue ?? 0) - Number(rightValue ?? 0);
  });

  return direction === "asc" ? sorted : sorted.reverse();
}

function normalizePaletteId(value) {
  return PALETTES.some((palette) => palette.id === value) ? value : PALETTES[0].id;
}

function getNextPaletteId(currentId) {
  const currentIndex = PALETTES.findIndex((palette) => palette.id === currentId);
  return PALETTES[(currentIndex + 1 + PALETTES.length) % PALETTES.length].id;
}

/* ── root ── */
export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

/* ── shell (unified state) ── */
function AppShell() {
  /* shared criteria */
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);

  /* single unified row set — starts with sample data, search appends into it */
  const [rows, setRows] = useState(SAMPLE_SHEET_ROWS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "total", direction: "desc" });
  const [paletteId, setPaletteId] = useState(() => {
    if (typeof window === "undefined") return PALETTES[0].id;
    return normalizePaletteId(window.localStorage.getItem(PALETTE_STORAGE_KEY));
  });

  /* search */
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { properties, loading, error, search } = useProperties();

  /* header scroll */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const normalized = normalizePaletteId(paletteId);
    document.documentElement.dataset.palette = normalized;
    window.localStorage.setItem(PALETTE_STORAGE_KEY, normalized);
  }, [paletteId]);

  /* derived */
  const rowsWithTotals = useMemo(() => attachTotals(rows, criteria), [rows, criteria]);
  const sortOptions = useMemo(
    () => [...STATIC_SORT_OPTIONS, ...criteria.map((criterion) => ({ key: criterion.key, label: criterion.label }))],
    [criteria],
  );
  const sortedRowsWithTotals = useMemo(
    () => sortRows(rowsWithTotals, sortConfig.key, sortConfig.direction),
    [rowsWithTotals, sortConfig],
  );
  const searchResults = useMemo(
    () => attachTotals(buildLiveSheetRowsWithCriteria(properties, criteria), criteria),
    [properties, criteria],
  );
  const selectedRows = useMemo(
    () => rowsWithTotals.filter((r) => selectedIds.includes(r.id)),
    [rowsWithTotals, selectedIds],
  );
  const currentPalette = useMemo(
    () => PALETTES.find((palette) => palette.id === paletteId) ?? PALETTES[0],
    [paletteId],
  );

  /* ── callbacks ── */
  const updateWeight = useCallback((key, value) => {
    setCriteria((prev) => prev.map((c) => (c.key === key ? { ...c, weight: Number(value) } : c)));
  }, []);

  const updateScore = useCallback((rowId, key, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, scores: { ...r.scores, [key]: clampScore(value) } } : r)),
    );
  }, []);

  const updateMeta = useCallback((rowId, key, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const updated = { ...r, [key]: value };
        if (key === "priceDisplay") {
          const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
          updated.price = Number.isFinite(numeric) ? numeric : r.price;
        }
        return updated;
      }),
    );
  }, []);

  const addRow = useCallback(() => setRows((prev) => [...prev, createEmptyRow(criteria)]), [criteria]);
  const deleteRow = useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  }, []);

  const addCriterion = useCallback(() => {
    const newCriterion = createCustomCriterion();
    setCriteria((prev) => [...prev, newCriterion]);
    setRows((prev) => prev.map((row) => ({
      ...row,
      scores: {
        ...row.scores,
        [newCriterion.key]: 3,
      },
    })));
  }, []);

  const updateCriterionLabel = useCallback((key, label) => {
    setCriteria((prev) => prev.map((criterion) => (
      criterion.key === key ? { ...criterion, label: label || "Column" } : criterion
    )));
  }, []);

  const deleteCriterion = useCallback((key) => {
    setCriteria((prev) => prev.filter((criterion) => criterion.key !== key));
    setRows((prev) => prev.map((row) => {
      const nextScores = { ...row.scores };
      delete nextScores[key];
      return { ...row, scores: nextScores };
    }));
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const doSearch = useCallback(async (nextFilters = filters) => {
    await search(nextFilters);
  }, [search, filters]);

  const addSearchResultToSheet = useCallback((resultRow) => {
    setRows((prev) => {
      if (prev.some((row) => row.id === resultRow.id)) return prev;
      return [...prev, withAllScores({ ...resultRow, isSearchResult: false }, criteria)];
    });
  }, [criteria]);

  const cyclePalette = useCallback(() => {
    setPaletteId((previous) => getNextPaletteId(previous));
  }, []);

  return (
    <div className="app">
      <Header scrolled={scrolled} paletteLabel={currentPalette.label} onCyclePalette={cyclePalette} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <SheetPage
                rows={sortedRowsWithTotals}
                criteria={criteria}
                sortConfig={sortConfig}
                sortOptions={sortOptions}
                onSortChange={setSortConfig}
                onScoreChange={updateScore}
                onWeightChange={updateWeight}
                onMetaChange={updateMeta}
                onAddRow={addRow}
                onDeleteRow={deleteRow}
                onAddCriterion={addCriterion}
                onUpdateCriterionLabel={updateCriterionLabel}
                onDeleteCriterion={deleteCriterion}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchPage
                rows={sortedRowsWithTotals}
                criteria={criteria}
                sortConfig={sortConfig}
                sortOptions={sortOptions}
                onSortChange={setSortConfig}
                filters={filters}
                setFilters={setFilters}
                onSearch={doSearch}
                loading={loading}
                error={error}
                onScoreChange={updateScore}
                onWeightChange={updateWeight}
                onMetaChange={updateMeta}
                onAddRow={addRow}
                onDeleteRow={deleteRow}
                onAddCriterion={addCriterion}
                onUpdateCriterionLabel={updateCriterionLabel}
                onDeleteCriterion={deleteCriterion}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                searchResults={searchResults}
                onAddSearchResult={addSearchResultToSheet}
              />
            }
          />
          <Route
            path="/insights"
            element={
              <InsightsPage
                selectedRows={selectedRows}
                criteria={criteria}
                onWeightChange={updateWeight}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/* ── Header ── */
function Header({ scrolled, paletteLabel, onCyclePalette }) {
  return (
    <header className={`app-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="hdr-inner">
        <NavLink to="/" className="hdr-logo">FutureBrick</NavLink>
        <div className="hdr-controls">
          <nav className="hdr-nav">
            {PAGES.map((p) => (
              <NavLink
                key={p.to}
                to={p.to}
                end={p.to === "/"}
                className={({ isActive }) => `hdr-link ${isActive ? "is-active" : ""}`}
              >
                {p.label}
              </NavLink>
            ))}
          </nav>

          <button type="button" className="hdr-theme-btn" onClick={onCyclePalette} aria-label={`Cycle colour palette. Current palette: ${paletteLabel}`}>
            <Palette size={15} />
            <span className="hdr-theme-btn__meta">Palette</span>
            <span className="hdr-theme-btn__name">{paletteLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Page 1: Sheet (minimal, editable, offline) ── */
function SheetPage({ rows, criteria, sortConfig, sortOptions, onSortChange, onScoreChange, onWeightChange, onMetaChange, onAddRow, onDeleteRow, onAddCriterion, onUpdateCriterionLabel, onDeleteCriterion }) {
  return (
    <section className="page page--sheet">
      <PageIntro
        kicker="Page 1 · Local"
        title="Your scoring sheet"
        description="A clean spreadsheet workspace for manually adding addresses, editing scores, and shaping your own shortlist."
      />

      <section className="panel-surface panel-surface--sheet">
        <div className="panel-toolbar">
          <div>
            <strong>Scoring Matrix</strong>
            <span>Every field is live, including metadata, weights, and scores.</span>
          </div>

          <SortMenu sortConfig={sortConfig} sortOptions={sortOptions} onSortChange={onSortChange} />
        </div>

        <ScoringSheet
          rows={rows}
          criteria={criteria}
          onScoreChange={onScoreChange}
          onWeightChange={onWeightChange}
          onMetaChange={onMetaChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
          onAddCriterion={onAddCriterion}
          onUpdateCriterionLabel={onUpdateCriterionLabel}
          onDeleteCriterion={onDeleteCriterion}
        />
      </section>
    </section>
  );
}

/* ── Page 2: Search (sheet + search bar, results append) ── */
function SearchPage({
  rows, criteria, sortConfig, sortOptions, onSortChange, filters, setFilters, onSearch, loading, error,
  onScoreChange, onWeightChange, onMetaChange, onAddRow, onDeleteRow,
  onAddCriterion, onUpdateCriterionLabel, onDeleteCriterion,
  selectedIds, onToggleSelect, searchResults, onAddSearchResult,
}) {
  const sheetIds = useMemo(() => new Set(rows.map((row) => row.id)), [rows]);

  return (
    <section className="page page--search">
      <PageIntro
        kicker="Page 2 · Connected"
        title="Search and enrich the sheet"
        description=" Search live listings, then add them into your sheet with one click."/>

      <section className="panel-surface panel-surface--search">
        <div className="panel-toolbar">
          <div>
            <strong> Scoring Matrix</strong>
            <span>Use the same editable matrix here, then compare selected rows in Insights.</span>
          </div>

          <SortMenu sortConfig={sortConfig} sortOptions={sortOptions} onSortChange={onSortChange} />
        </div>

        <ScoringSheet
          rows={rows}
          criteria={criteria}
          onScoreChange={onScoreChange}
          onWeightChange={onWeightChange}
          onMetaChange={onMetaChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
          onAddCriterion={onAddCriterion}
          onUpdateCriterionLabel={onUpdateCriterionLabel}
          onDeleteCriterion={onDeleteCriterion}
          showSelection
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          readOnlyMeta={false}
        />
      </section>

      <section className="panel-surface panel-surface--results">
        <div className="panel-toolbar panel-toolbar--stacked">
          <div>
            <strong>Search and results</strong>
            <span>Search externally, preview the scored result set, then add only the ones you want into the sheet above.</span>
          </div>

          <div className="search-top">
            <SearchBar filters={filters} onFiltersChange={setFilters} onSearch={onSearch} onTogglePanel={() => {}} />
          </div>
        </div>

        {loading && <div className="status-bar"><WandSparkles size={15} /> Searching live listings…</div>}
        {error && <div className="status-bar status-bar--err">Error: {error}</div>}

        <SearchResultsList
          rows={searchResults}
          sheetIds={sheetIds}
          onAdd={onAddSearchResult}
        />
      </section>

      {selectedIds.length > 0 && (
        <div className="sel-drawer">
          <strong>{selectedIds.length} selected</strong>
          <span>— view them on the Insights page</span>
        </div>
      )}
    </section>
  );
}

function SearchResultsList({ rows, sheetIds, onAdd }) {
  if (rows.length === 0) {
    return (
      <div className="results-empty">
        Run a search to populate external listings here. Nothing gets added to your sheet until you explicitly choose it.
      </div>
    );
  }

  return (
    <div className="results-list">
      {rows.map((row) => {
        const inSheet = sheetIds.has(row.id);
        return (
          <article key={row.id} className="result-card">
            <div className="result-card__main">
              <div className="result-card__top">
                <strong>{row.address}</strong>
                <span className="result-chip">{row.priceDisplay || "Contact Agent"}</span>
              </div>

              <div className="result-meta">
                <span>{row.suburb || "Metro"}</span>
                <span>{row.propertyType || "Property"}</span>
                <span>{row.bedrooms} bed</span>
                <span>{row.bathrooms} bath</span>
                <span>{row.toilets} wc</span>
                <span>{row.parking ?? 0} car</span>
                {row.landSize ? <span>{row.landSize} sqm</span> : null}
                {row.daysOnMarket ? <span>{row.daysOnMarket} DOM</span> : null}
                {row.walkScore ? <span>Walk {row.walkScore}</span> : null}
                {row.schoolRating ? <span>School {row.schoolRating}/10</span> : null}
              </div>
            </div>

            <div className="result-card__score">
              <span>Total</span>
              <strong>{Math.round(row.total * 10) / 10}</strong>
            </div>

            <button
              type="button"
              className={`result-add-btn ${inSheet ? "is-added" : ""}`}
              onClick={() => onAdd(row)}
              disabled={inSheet}
            >
              {inSheet ? "Added" : "Add to sheet"}
            </button>
          </article>
        );
      })}
    </div>
  );
}

function PageIntro({ kicker, title, description }) {
  return (
    <header className="page-intro">
      <span className="page-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function SortMenu({ sortConfig, sortOptions, onSortChange }) {
  return (
    <details className="sort-menu">
      <summary className="sort-menu__trigger">
        <ArrowUpDown size={14} /> Sort
      </summary>

      <div className="sort-menu__panel">
        <label className="sort-menu__field">
          <span>Column</span>
          <select
            value={sortConfig.key}
            onChange={(event) => onSortChange((previous) => ({ ...previous, key: event.target.value }))}
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="sort-menu__field">
          <span>Direction</span>
          <select
            value={sortConfig.direction}
            onChange={(event) => onSortChange((previous) => ({ ...previous, direction: event.target.value }))}
          >
            <option value="desc">Highest first</option>
            <option value="asc">Lowest first</option>
          </select>
        </label>
      </div>
    </details>
  );
}
