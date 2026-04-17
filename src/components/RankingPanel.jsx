import { useMemo, useState } from "react";
import { Plus, Minus, RotateCcw, X } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { RANKING_CATEGORIES } from "../data/config";

export default function RankingPanel({
  weights,
  onWeightsChange,
  onClose,
  customCriteria = [],
  onAddCustomCriterion,
  onUpdateCustomCriterion,
  onRemoveCustomCriterion,
}) {
  const [newCriterion, setNewCriterion] = useState("");

  const totalWeight = useMemo(() => {
    const official = weights.reduce((sum, item) => sum + item.weight, 0);
    const custom = customCriteria.reduce((sum, item) => sum + item.weight, 0);
    return official + custom;
  }, [weights, customCriteria]);

  const updateWeight = (key, delta) => {
    onWeightsChange(
      weights.map((item) => (item.key === key ? { ...item, weight: Math.max(0, Math.min(10, item.weight + delta)) } : item)),
    );
  };

  const reset = () => {
    onWeightsChange(weights.map((item) => ({ ...item, weight: 0 })));
    customCriteria.forEach((item) => onUpdateCustomCriterion?.(item.id, { weight: 0 }));
  };

  const addCustom = () => {
    if (!onAddCustomCriterion) return;
    onAddCustomCriterion(newCriterion);
    setNewCriterion("");
  };

  return (
    <div className="ranking-panel">
      <div className="ranking-panel-header">
        <div>
          <h2 className="ranking-panel-title">Ranking criteria</h2>
          <p className="ranking-panel-sub">Use cards instead of sliders. Adjust the value, add custom priorities, and watch the total animate.</p>
        </div>
        <div className="ranking-panel-actions">
          <button className="icon-btn" onClick={reset} title="Reset all">
            <RotateCcw size={16} />
          </button>
          {onClose && (
            <button className="icon-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="ranking-total-card">
        <span>Total weight</span>
        <strong>
          <AnimatedNumber value={totalWeight} />
        </strong>
        <p>Official + custom priorities.</p>
      </div>

      <div className="ranking-strip" role="list" aria-label="Ranking categories">
        {RANKING_CATEGORIES.map((category) => {
          const item = weights.find((entry) => entry.key === category.key) || { weight: 0 };
          const active = item.weight > 0;

          return (
            <article key={category.key} className={`ranking-box ${active ? "active" : ""}`} role="listitem">
              <div className="ranking-box-head">
                <div>
                  <span className="ranking-box-label">{category.label}</span>
                  <p>{category.description}</p>
                </div>
                <AnimatedNumber className="ranking-box-value" value={item.weight} />
              </div>

              <div className="ranking-box-controls">
                <button className="step-btn" onClick={() => updateWeight(category.key, -1)} aria-label={`Decrease ${category.label}`}>
                  <Minus size={14} />
                </button>
                <span className="step-pill">{item.weight}</span>
                <button className="step-btn" onClick={() => updateWeight(category.key, 1)} aria-label={`Increase ${category.label}`}>
                  <Plus size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="ranking-custom">
        <div className="ranking-custom-head">
          <h3>Custom priorities</h3>
          <p>Add any extra criterion that matters to you.</p>
        </div>

        <div className="custom-add-row">
          <input
            type="text"
            value={newCriterion}
            onChange={(event) => setNewCriterion(event.target.value)}
            placeholder="e.g. outdoor space, study nook, north-facing"
          />
          <button className="cta-btn" onClick={addCustom}>
            Add
          </button>
        </div>

        {customCriteria.length > 0 && (
          <div className="custom-list">
            {customCriteria.map((item) => (
              <article key={item.id} className="ranking-box ranking-box--custom">
                <div className="ranking-box-head">
                  <div>
                    <span className="ranking-box-label">{item.label}</span>
                    <p>Custom weight</p>
                  </div>
                  <AnimatedNumber className="ranking-box-value" value={item.weight} />
                </div>

                <div className="ranking-box-controls">
                  <button className="step-btn" onClick={() => onUpdateCustomCriterion(item.id, { weight: Math.max(0, item.weight - 1) })}>
                    <Minus size={14} />
                  </button>
                  <span className="step-pill">{item.weight}</span>
                  <button className="step-btn" onClick={() => onUpdateCustomCriterion(item.id, { weight: Math.min(10, item.weight + 1) })}>
                    <Plus size={14} />
                  </button>
                  <button className="step-btn step-btn--ghost" onClick={() => onRemoveCustomCriterion(item.id)} title="Remove">
                    <X size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
