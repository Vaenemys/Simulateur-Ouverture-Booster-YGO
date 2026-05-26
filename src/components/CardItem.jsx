import { useMemo, useState } from 'react';

const EMPTY_VALUE = '—';
const DESCRIPTION_LIMIT = 260;

export default function CardItem({
  card,
  onChoose,
  isChosen,
  canChooseCard = false,
  showMarketInfo = true,
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const description = card.desc ?? '';
  const shouldCollapseDescription = description.length > DESCRIPTION_LIMIT;

  const shortDescription = useMemo(() => {
    if (!shouldCollapseDescription) {
      return description;
    }

    const cutDescription = description.slice(0, DESCRIPTION_LIMIT);
    return cutDescription.replace(/\s+\S*$/, '').trim();
  }, [description, shouldCollapseDescription]);

  const displayedDescription = isDescriptionExpanded ? description : shortDescription;

  return (
    <article className={`card ${isChosen ? 'card--chosen' : ''}`}>
      {card.image && <img className="card__image" src={card.image} alt={card.name} loading="lazy" />}

      <div className="card__content">
        <div className="card__header">
          <h3>{card.name}</h3>

          <div className="pill-row">
            {card.rarity && <span className="rarity">{card.rarity}</span>}
            {<span className="price" title={card.priceSource}>{card.priceLabel}</span>}
          </div>
        </div>

        <dl className="stats">
          <Row label="Carte" value={card.type} />
          <Row label="Type" value={card.race} />
          <Row label="Attribut" value={card.attribute} />
          <Row label="Niveau" value={card.level} />
          <Row label="ATK" value={card.atk} />
          <Row label="DEF" value={card.def} />
          <Row label="Échelle pendule" value={card.scale} />
          <Row label="Lien" value={card.linkval} />
        </dl>

        {description && (
          <div className="description-block">
            <p className="description">{displayedDescription}</p>

            {shouldCollapseDescription && (
              <button
                type="button"
                className="text-button"
                onClick={() => setIsDescriptionExpanded((currentValue) => !currentValue)}
              >
                {isDescriptionExpanded ? 'Réduire la description' : 'Voir la description complète'}
              </button>
            )}
          </div>
        )}

        {canChooseCard && (
          <button type="button" className="secondary-button" onClick={() => onChoose(card)}>
            {isChosen ? 'Carte sélectionnée' : 'Sélectionner cette carte'}
          </button>
        )}
      </div>
    </article>
  );
}

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ?? EMPTY_VALUE}</dd>
    </div>
  );
}
