import { Bed, Bath, Car, MapPin, Maximize2, CalendarDays, Building2, ExternalLink, Star } from "lucide-react";

function formatPrice(price, displayPrice) {
  if (!price) return displayPrice || "Contact Agent";
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}m`;
  return `$${price.toLocaleString()}`;
}

function ScoreBadge({ score }) {
  const color =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : score >= 25 ? "#f97316" : "#94a3b8";
  return (
    <div className="score-badge" style={{ "--badge-color": color }}>
      <div className="score-ring">
        <svg viewBox="0 0 36 36" className="score-svg">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${score} 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="score-num">{score}</span>
      </div>
      <span className="score-label">Score</span>
    </div>
  );
}

export default function PropertyCard({ property, rank, isRanked }) {
  const {
    address, suburb, postcode, state, price, displayPrice,
    bedrooms, bathrooms, parking, landSize, propertyType,
    image, description, score, daysOnMarket, distanceToCBD,
    listingUrl, agencyName, isNew, auctionDate, inspectionTimes = [],
    hasFloorplan,
  } = property;

  return (
    <div className={`property-card ${isRanked ? "ranked" : ""}`}>
      {isRanked && (
        <div className="rank-badge">
          <Star size={11} fill="currentColor" />
          #{rank}
        </div>
      )}

      <div className="card-image-wrap">
        {image ? (
          <img src={image} alt={address} className="card-image" loading="lazy" />
        ) : (
          <div className="card-image-placeholder">
            <Building2 size={40} strokeWidth={1} />
          </div>
        )}
        <span className="property-type-chip">{propertyType}</span>
        {isNew && <span className="new-chip">New</span>}
      </div>

      <div className="card-body">
        <div className="card-top">
          <div className="card-address">
            <MapPin size={13} />
            <span>{address}</span>
          </div>
          <span className="card-suburb">{suburb}{postcode ? ` ${postcode}` : ""}{state ? `, ${state}` : ""}</span>
          <span className="card-price">{formatPrice(price, displayPrice)}</span>
        </div>

        {description && <p className="card-desc">{description.slice(0, 160)}{description.length > 160 ? "..." : ""}</p>}

        <div className="card-stats">
          {bedrooms != null && <span><Bed size={13} /> {bedrooms} bed</span>}
          {bathrooms != null && <span><Bath size={13} /> {bathrooms} bath</span>}
          {parking != null && <span><Car size={13} /> {parking} car</span>}
          {landSize > 0 && <span><Maximize2 size={13} /> {landSize.toLocaleString()} sqm</span>}
          {distanceToCBD != null && <span><MapPin size={13} /> {distanceToCBD}km CBD</span>}
          {daysOnMarket != null && <span><CalendarDays size={13} /> {daysOnMarket}d listed</span>}
        </div>

        {auctionDate && (
          <p className="card-auction">
            Auction: {new Date(auctionDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}

        {inspectionTimes.length > 0 && (
          <p className="card-inspection">
            Inspection: {new Date(inspectionTimes[0].openingTime).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
          </p>
        )}

        <div className="card-footer">
          {agencyName && <span className="card-agency">{agencyName}</span>}
          <div className="card-links">
            {hasFloorplan && <span className="card-tag">Floorplan</span>}
            {listingUrl && (
              <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="card-domain-link">
                View on Domain <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {isRanked && (
        <div className="card-score">
          <ScoreBadge score={score} />
        </div>
      )}
    </div>
  );
}
