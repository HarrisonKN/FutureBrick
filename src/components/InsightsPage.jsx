import { useMemo } from "react";
import { weightedTotal } from "../data/spreadsheet";

/* ── Pure CSS bar chart comparing properties across criteria ── */
function CriteriaChart({ rows, criteria }) {
  if (rows.length === 0) return <p className="ins-empty">Select rows on the Sheet or Search page to compare.</p>;

  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
  ];

  return (
    <div className="ins-chart">
      {criteria.map((c) => (
        <div key={c.key} className="ins-chart-row">
          <span className="ins-chart-label">{c.label}</span>
          <div className="ins-chart-bars">
            {rows.map((row, i) => {
              const score = row.scores?.[c.key] ?? 0;
              return (
                <div key={row.id} className="ins-bar-wrap" title={`${row.address}: ${score}`}>
                  <div className="ins-bar-track">
                    <div className="ins-bar" style={{ width: `${(score / 5) * 100}%`, background: colors[i % colors.length] }} />
                  </div>
                  <span className="ins-bar-val">{score}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="ins-chart-legend">
        {rows.map((row, i) => (
          <span key={row.id} className="ins-legend-item">
            <span className="ins-legend-dot" style={{ background: colors[i % colors.length] }} />
            {row.address || `Row ${i + 1}`}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── What-If weight sliders ── */
function WhatIfPanel({ criteria, onWeightChange, rows }) {
  const ranked = useMemo(
    () => [...rows].sort((a, b) => weightedTotal(b, criteria) - weightedTotal(a, criteria)),
    [rows, criteria],
  );

  if (rows.length === 0) {
    return <p className="ins-empty">Tick properties on the Sheet or Search page to unlock ranking and what-if analysis.</p>;
  }

  return (
    <div className="ins-whatif">
      <div className="ins-sliders">
        {criteria.map((c) => (
          <label key={c.key} className="ins-slider-row">
            <span className="ins-slider-label">{c.label}</span>
            <input
              type="range" min="0" max="3" step="0.1"
              value={c.weight}
              onChange={(e) => onWeightChange(c.key, Number(e.target.value))}
              className="ins-slider"
            />
            <span className="ins-slider-val">{c.weight.toFixed(1)}</span>
          </label>
        ))}
      </div>
      <div className="ins-ranking">
        <h4>Live ranking</h4>
        {ranked.slice(0, 5).map((row, i) => (
          <div key={row.id} className="ins-rank-row">
            <span className="ins-rank-pos">{i + 1}</span>
            <span className="ins-rank-addr">{row.address || "—"}</span>
            <span className="ins-rank-score">{Math.round(weightedTotal(row, criteria) * 10) / 10}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recommendation card ── */
function RecommendationCard({ rows, criteria }) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => weightedTotal(b, criteria) - weightedTotal(a, criteria)),
    [rows, criteria],
  );
  if (sorted.length < 2) return <p className="ins-empty">Need at least 2 properties to generate a recommendation.</p>;

  const best = sorted[0];
  const second = sorted[1];
  const bestTotal = weightedTotal(best, criteria);
  const secondTotal = weightedTotal(second, criteria);
  const gap = bestTotal - secondTotal;
  const pct = secondTotal > 0 ? ((gap / secondTotal) * 100).toFixed(1) : "∞";

  return (
    <div className="ins-rec">
      <div className="ins-rec-winner">
        <span className="ins-rec-label">Top pick</span>
        <strong>{best.address || "—"}</strong>
        <span className="ins-rec-total">{Math.round(bestTotal * 10) / 10}</span>
      </div>
      <p className="ins-rec-text">
        Leads <strong>{second.address || "—"}</strong> by {Math.round(gap * 10) / 10} pts ({pct}%).
        {gap > 5 ? " A clear frontrunner." : gap > 2 ? " A moderate lead — worth deliberating." : " Very close — review the criteria breakdown."}
      </p>
    </div>
  );
}

/* ── Head-to-head ── */
function HeadToHead({ rows, criteria }) {
  const items = rows;
  if (items.length < 2) return <p className="ins-empty">Select at least 2 properties to compare head-to-head.</p>;

  return (
    <div className="ins-h2h">
      <table className="ins-h2h-table">
        <thead>
          <tr>
            <th>Criterion</th>
            {items.map((r) => <th key={r.id}>{r.address || "—"}</th>)}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => {
            const vals = items.map((r) => r.scores?.[c.key] ?? 0);
            const maxVal = Math.max(...vals);
            return (
              <tr key={c.key}>
                <td>{c.label} <small>×{c.weight.toFixed(1)}</small></td>
                {items.map((r, i) => (
                  <td key={r.id} className={vals[i] === maxVal && maxVal > 0 ? "is-best" : ""}>
                    {vals[i]}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr className="ins-h2h-total">
            <td>Total</td>
            {items.map((r) => {
              const t = weightedTotal(r, criteria);
              return <td key={r.id}>{Math.round(t * 10) / 10}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Main export ── */
export default function InsightsPage({ selectedRows, criteria, onWeightChange }) {
  const compareRows = selectedRows;

  return (
    <section className="page page--insights">
      <div className="ins-shell">
        <header className="ins-header">
          <h1>Insights</h1>
          <p>Decision support for the properties you explicitly select. Tick rows first, then compare and stress-test them here.</p>
        </header>

        <div className="ins-grid">
          <section className="ins-card ins-card--chart">
            <h3>Criteria comparison</h3>
            <CriteriaChart rows={compareRows} criteria={criteria} />
          </section>

          <section className="ins-card ins-card--rec">
            <h3>Recommendation</h3>
            <RecommendationCard rows={selectedRows} criteria={criteria} />
          </section>

          <section className="ins-card ins-card--whatif">
            <h3>What if?</h3>
            <WhatIfPanel criteria={criteria} onWeightChange={onWeightChange} rows={selectedRows} />
          </section>

          <section className="ins-card ins-card--h2h">
            <h3>Head to head</h3>
            <HeadToHead rows={compareRows} criteria={criteria} />
          </section>
        </div>
      </div>
    </section>
  );
}
