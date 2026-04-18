import { Fragment } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { clampScore, formatCurrency, weightedTotal } from "../data/spreadsheet";

const META_COLS = [
  { key: "address", label: "Address", width: "minmax(320px, 2.6fr)", type: "text" },
  { key: "priceDisplay", label: "Price", width: "minmax(170px, 1.15fr)", type: "text" },
  { key: "dateInspected", label: "Inspected", width: "132px", type: "text" },
  { key: "bedrooms", label: "Bed", width: "62px", type: "number" },
  { key: "bathrooms", label: "Bathrooms", width: "88px", type: "number" },
  { key: "toilets", label: "Toilets", width: "88px", type: "number" },
];

export default function ScoringSheet({
  rows,
  criteria,
  onScoreChange,
  onWeightChange,
  onMetaChange,
  onAddRow,
  onDeleteRow,
  onAddCriterion,
  onUpdateCriterionLabel,
  onDeleteCriterion,
  showSelection = false,
  selectedIds = [],
  onToggleSelect,
  readOnlyMeta = false,
}) {
  const columns = [
    { key: "_row", label: "#", width: "36px" },
    ...(showSelection ? [{ key: "_sel", label: "✓", width: "36px" }] : []),
    ...META_COLS,
    { key: "_spacer", label: "", width: "10px", spacer: true },
    ...criteria.map((c) => ({
      key: c.key, label: c.label, width: "120px", criterion: c,
    })),
    ...(onAddCriterion ? [{ key: "_insert", label: "", width: "56px", insert: true }] : []),
    ...(onDeleteRow ? [{ key: "_del", letter: "", label: "", width: "32px" }] : []),
    { key: "_total", label: "Total", width: "96px", total: true },
  ];

  const gridCols = columns.map((c) => c.width).join(" ");

  return (
    <div className="sheet">
      <div className="sheet-scroll">
        <div className="sheet-grid" style={{ gridTemplateColumns: gridCols }}>
          {/* header row */}
          {columns.map((col) => {
            if (col.spacer) return <div key={`H-${col.key}`} className="sh-hd is-spacer" />;
            if (col.total) return <div key={`H-${col.key}`} className="sh-hd is-total">Total</div>;
            if (col.insert) {
              return (
                <div key={`H-${col.key}`} className="sh-hd sh-hd--insert">
                  <button type="button" className="sh-insert-btn" onClick={() => onAddCriterion?.()}>
                    +
                  </button>
                </div>
              );
            }
            if (col.key === "_row" || col.key === "_sel" || col.key === "_del") {
              return <div key={`H-${col.key}`} className="sh-hd sh-hd--tiny">{col.label}</div>;
            }
            if (col.criterion) {
              return (
                <div key={`H-${col.key}`} className="sh-hd sh-hd--criterion">
                  <div className="sh-criterion-top">
                    {col.criterion.isCustom ? (
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => onUpdateCriterionLabel?.(col.criterion.key, e.target.value)}
                        className="sh-criterion-name"
                        placeholder="Column"
                      />
                    ) : (
                      <span className="sh-criterion-label">{col.label}</span>
                    )}

                    {col.criterion.isCustom && (
                      <button
                        type="button"
                        className="sh-criterion-delete"
                        onClick={() => onDeleteCriterion?.(col.criterion.key)}
                        aria-label={`Delete ${col.label}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <input
                    type="number" min="0" max="3" step="0.1"
                    value={col.criterion.weight}
                    onChange={(e) => onWeightChange(col.criterion.key, e.target.value)}
                    className="sh-weight"
                  />
                </div>
              );
            }
            return <div key={`H-${col.key}`} className="sh-hd">{col.label}</div>;
          })}

          {/* data rows */}
          {rows.map((row, rowIdx) => {
            const total = weightedTotal(row, criteria);
            const selected = selectedIds.includes(row.id);
            const isSearch = row.isSearchResult;

            return (
              <Fragment key={row.id}>
                {/* row number */}
                <div className={`sh-cell sh-cell--num ${isSearch ? "is-search" : ""}`}>{rowIdx + 1}</div>

                {/* selection checkbox */}
                {showSelection && (
                  <button
                    type="button"
                    className={`sh-cell sh-cell--sel ${selected ? "is-on" : ""}`}
                    onClick={() => onToggleSelect?.(row.id)}
                  >
                    {selected ? "●" : "○"}
                  </button>
                )}

                {/* metadata cells */}
                {META_COLS.map((col) => (
                  <div
                    key={`${row.id}-${col.key}`}
                    className={`sh-cell sh-cell--meta ${col.key === "address" ? "sh-cell--addr" : ""} ${col.key === "priceDisplay" ? "sh-cell--price" : ""} ${isSearch ? "is-search" : ""}`}
                  >
                    {readOnlyMeta || isSearch ? (
                      <span className="sh-meta-value">{col.key === "priceDisplay" ? (row.priceDisplay || formatCurrency(row.price)) : (row[col.key] ?? "")}</span>
                    ) : (
                      <input
                        type={col.type}
                        value={col.key === "priceDisplay" ? (row.priceDisplay || formatCurrency(row.price)) : (row[col.key] ?? "")}
                        onChange={(e) => onMetaChange?.(row.id, col.key, col.type === "number" ? Number(e.target.value) : e.target.value)}
                        placeholder={col.label}
                        className="sh-meta-input"
                      />
                    )}
                  </div>
                ))}

                {/* spacer */}
                <div className="sh-cell is-spacer" />

                {/* score cells */}
                {criteria.map((c) => (
                  <div key={`${row.id}-${c.key}`} className="sh-cell sh-cell--score">
                    <input
                      type="number" min="1" max="5" step="1"
                      value={row.scores?.[c.key] ?? 3}
                      onChange={(e) => onScoreChange(row.id, c.key, clampScore(e.target.value))}
                    />
                  </div>
                ))}

                {onAddCriterion && <div className="sh-cell sh-cell--insert-gap" />}

                {/* delete button */}
                {onDeleteRow && (
                  <button type="button" className="sh-cell sh-cell--del" onClick={() => onDeleteRow(row.id)}>
                    <Trash2 size={13} />
                  </button>
                )}

                {/* total */}
                <div className="sh-cell sh-cell--total">{Math.round(total * 10) / 10}</div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* add row */}
      {onAddRow && (
        <button type="button" className="sh-add-row" onClick={onAddRow}>
          <Plus size={14} /> Add row
        </button>
      )}
    </div>
  );
}
