/**
 * Scoring engine — ranks a list of properties based on user-selected
 * categories and their assigned weights (0–10).
 *
 * For each active category the raw value is normalised to 0-1 across
 * the entire dataset, inverted when "lower is better", multiplied by
 * its weight, then summed. The final score is expressed as a 0-100 value.
 */

export function scoreProperties(properties, categoryWeights) {
  const active = categoryWeights.filter((c) => c.weight > 0);
  if (active.length === 0) return properties.map((p) => ({ ...p, score: 0 }));

  const ranges = {};
  active.forEach(({ key }) => {
    const vals = properties.map((p) => p[key]).filter((v) => v != null && !isNaN(v));
    ranges[key] = vals.length
      ? { min: Math.min(...vals), max: Math.max(...vals) }
      : { min: 0, max: 1 };
  });

  return properties.map((p) => {
    let weightedSum = 0;
    let usedWeight = 0;
    active.forEach(({ key, weight, higherIsBetter }) => {
      const val = p[key];
      if (val == null || isNaN(val)) return; // skip unavailable fields
      const { min, max } = ranges[key];
      let norm = (val - min) / (max - min || 1);
      if (!higherIsBetter) norm = 1 - norm;
      weightedSum += norm * weight;
      usedWeight += weight;
    });
    const score = usedWeight > 0 ? Math.round((weightedSum / usedWeight) * 100) : 0;
    return { ...p, score };
  });
}

export function sortByScore(properties) {
  return [...properties].sort((a, b) => b.score - a.score);
}

export function filterProperties(properties, filters) {
  return properties.filter((p) => {
    if (filters.suburb && filters.suburb !== "All" && p.suburb !== filters.suburb) return false;
    if (filters.propertyType && filters.propertyType !== "All" && p.propertyType !== filters.propertyType) return false;
    if (filters.minBeds && p.bedrooms < filters.minBeds) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      if (
        !p.address.toLowerCase().includes(q) &&
        !p.suburb.toLowerCase().includes(q) &&
        !p.postcode.includes(q)
      )
        return false;
    }
    return true;
  });
}
