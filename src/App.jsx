import { useMemo, useState, useEffect } from 'react';
import BoosterGrid from './components/BoosterGrid.jsx';
import SetSelector from './components/SetSelector.jsx';
import boosterSets from './data/boosterSets.json';
import { CardList } from './models/CardList.js';
import { CardCollection } from './models/CardCollection.js';
import { addInstanceIds, generateBooster, generateRandomSelection, getNextOpeningNumber } from './services/booster.js';
import { fetchAllCards, fetchCardsBySet } from './services/ygoApi.js';

const MODES = {
  classic: {
    title: 'Ouverture classique',
    description: 'Choisissez un booster, ouvrez 9 cartes et ajoutez automatiquement toutes les cartes ouvertes à votre collection.',
    button: 'Ouvrir le booster',
  },

  draft: {
  title: 'Ouverture draft',
  description: 'Ouvrez un booster de 9 cartes aléatoire, puis choisissez en une à ajouter à votre collection',
  button: 'Ouvrir le booster',
  },

  random: {
    title: 'Ouverture fun',
    description: 'Générez 9 cartes complètement aléatoires parmi toute la base Yu-Gi-Oh!, sans contrainte d’extension ni de rareté.',
    button: 'Prendre 9 cartes aléatoires',
  },
};

const RARITY_ORDER = {
  'Common': 1,
  'Rare': 2,
  'Super Rare': 3,
  'Ultra Rare': 4,
  'Secret Rare': 5,
  "Collector's Rare": 6,
  'Starlight Rare': 7,
  'Ultimate Rare' : 8,
  'Quarter Century Secret Rare' : 9,
};

export default function App() {
  const [mode, setMode] = useState(null);
  const [selectedSetId, setSelectedSetId] = useState(boosterSets[0].id);
  const [openingNumber, setOpeningNumber] = useState(0);
  const [openingInternalCounter, setOpeningInternalCounter] = useState(0);
  const [currentCards, setCurrentCards] = useState([]);
  const [collection, setCollection] = useState(() => new CardCollection());
  const [selectedCard, setSelectedCard] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const selectedSet = boosterSets.find((boosterSet) => {
  return boosterSet.id === selectedSetId;
  });

  
  function getSelectedSet() {
    const set = boosterSets.find((boosterSet) => {
      return boosterSet.id === selectedSetId;
    });

    if (!set) {
      throw new Error(`Set introuvable pour l'id : ${selectedSetId}`);
    }

    return set;
  }

  //TODO: Optimisation à faire afin que la carte ne soit pas rangé dans la collection après l'ouverture du booster suivant
  async function openCards() {
    try {
      setStatus('loading');
      setError('');

      let openedCards = [];

      if (mode === 'classic') {
        const selectedSet = getSelectedSet();

        const nextOpeningNumber = openingNumber + 1;
        const nextOpeningInternalCounter = getOpeningInternalCounter(openingInternalCounter); //Compteur en interne pour reset les raretés une fois arrivé à 12 afin de respecter les ratios de raretés par display
        const cardList = await fetchCardsBySet(selectedSet.apiName);
        console.log('selectedSet envoyé au Booster:', selectedSet);
        console.log('baseSlots:', selectedSet.baseSlots);
        openedCards = generateBooster(
          cardList,
          selectedSet,
          nextOpeningInternalCounter
        );

        setOpeningNumber(nextOpeningNumber);
        setOpeningInternalCounter(nextOpeningInternalCounter);
      }

      if (mode === 'random' || mode === 'draft') {
        const cardList = await fetchAllCards();

        openedCards = generateRandomSelection(cardList, 9);
      }

      setCurrentCards(openedCards);
      setSelectedCard(null);

      if (mode !== 'draft') {
        setCollection((currentCollection) =>
          currentCollection.addMany(openedCards)
        );
      }

      setStatus('success');
    } catch (error) {
      setError(error.message);
      setStatus('error');
    }
  }

  function getOpeningInternalCounter(currentNumber) {
    return currentNumber >= 12 ? 1 : currentNumber + 1;
  }

  function handleSetChange(setId) {
    setSelectedSetId(setId);
    setOpeningNumber(0);
    setOpeningInternalCounter(0);
    setCurrentCards([]);
    setSelectedCard(null);
    setError('');
    setStatus('idle');
  }

  function chooseCard(card) {
    setSelectedCard(card);
  }

  function selectMode(nextMode) {
    setMode(nextMode);
    setCurrentCards([]);
    setSelectedCard(null);
    setError('');
    setStatus('idle');
    setOpeningNumber(0);
    setOpeningInternalCounter(0);
  }

  function goBackToMenu() {
    setMode(null);
    setCurrentCards([]);
    setSelectedCard(null);
    setError('');
    setStatus('idle');
    setOpeningNumber(0);
    setOpeningInternalCounter(0);
  }

  function resetCollection() {
    setCollection((currentCollection) => currentCollection.clear());
    setSelectedCard(null);
  }

  if (!mode) {
    return (
      <main className="app-shell">
        <section className="hero">
          <p className="eyebrow">Yu-Gi-Oh! Pack Opener by Vaene</p>
          <h1>Menu principal</h1>
          <p>Choisissez un mode d’ouverture. Votre collection reste conservée tant que la page n’est pas rechargée.</p>
        </section>

        <section className="mode-grid" aria-label="Sélection du mode de jeu">
          <button type="button" className="mode-card" onClick={() => selectMode('classic')}>
            <span>Mode classique</span>
            <strong>Ouverture de boosters</strong>
            <p>Ouvrez les boosters configurés et ajoutez automatiquement chaque carte ouverte à votre liste.</p>
          </button>

          <button type="button" className="mode-card" onClick={() => selectMode('draft')}>
            <span>Mode draft</span>
            <strong>1 carte parmi 9</strong>
            <p>Ouvrez un booster de 9 cartes aléatoire, puis sélectionnez en une.</p>
          </button>

          <button type="button" className="mode-card" onClick={() => selectMode('random')}>
            <span>Mode fun</span>
            <strong>9 cartes full random</strong>
            <p>Piochez 9 cartes totalement aléatoires dans toute la base de données.</p>
          </button>
        </section>

        <CollectionPanel collection={collection} onReset={resetCollection} />
      </main>
    );
  }

  const activeMode = MODES[mode];
  const showMarketInfo = mode === 'classic';

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Yu-Gi-Oh! Pack Opener by Vaene</p>
        <h1>{activeMode.title}</h1>
        <p>{activeMode.description}</p>

        <div className="controls">
          {mode === 'classic' && (
            <SetSelector
              sets={boosterSets}
              selectedSetId={selectedSetId}
              onChange={handleSetChange}
              disabled={status === 'loading'}
            />
          )}

          <button type="button" className="primary-button" onClick={openCards} disabled={status === 'loading'}>
            {status === 'loading' ? 'Ouverture...' : activeMode.button}
          </button>

          <button type="button" className="ghost-button" onClick={goBackToMenu} disabled={status === 'loading'}>
            Retour au menu
          </button>
        </div>

        <div className="meta">
          {mode === 'classic' && (<span>Extension : {boosterSets.find((boosterSet) => boosterSet.id === selectedSetId)?.label
          ?? 'Extension inconnue'}</span>)}
          {mode === 'classic' && <span>Ouverture n° {openingNumber || 1}</span>}
          <span>Collection : {collection.count} carte{collection.count > 1 ? 's' : ''}</span>
          {showMarketInfo && <span>Valeur totale : {collection.totalValueLabel}</span>}
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {selectedCard && (
        <section className="selected-panel">
          <h2>Carte sélectionnée</h2>
          <p>
            <strong>{selectedCard.name}</strong>{selectedCard.rarity ? ` — ${selectedCard.rarity}` : ''}{showMarketInfo ? ` — ${selectedCard.priceLabel}` : ''}
          </p>
        </section>
      )}

      <BoosterGrid
        cards={currentCards}
        selectedCardInstanceId={selectedCard?.instanceId ?? null}
        onChoose={chooseCard}
        canChooseCard={mode === 'draft'}
        showMarketInfo={showMarketInfo}
      />

      <CollectionPanel collection={collection} onReset={resetCollection} showMarketInfo={showMarketInfo} />
    </main>
  );
}

function getCardCategoryClass(card) {
  if (card.isSpell) {
    return 'category-spell';
  }

  if (card.isTrap) {
    return 'category-trap';
  }

  return 'category-monster';
}

function CollectionPanel({ collection, onReset, showMarketInfo = true }) { //Collection de cartes
  //Sert à mettre en place le tri
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('list');

  const sortedGroups = useMemo(() => {
  return sortCollectionGroups(
    collection?.groupedCards ?? [],
    sortKey,
    sortDirection
  );
  }, [collection, sortKey, sortDirection]);

  if (!collection || collection.isEmpty) {
    return null;
  }

  return (
    <section className="chosen-panel">
      <div className="panel-title-row">
        <div className="collection-sort-bar">
          <label>
            Trier par
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
              <option value="type">Type</option>
              <option value="attribute">Attribut</option>
              <option value="quantity">Quantité</option>
              <option value="rarity">Rareté</option>
              {showMarketInfo && <option value="unitPrice">Prix</option>}
            </select>
          </label>
          <div className="view-mode-button">
          <button
            type="button"
            className={sortDirection === 'asc' ? 'sort-button active' : 'sort-button'}
            onClick={() => setSortDirection('asc')}>
            Asc
          </button>

          <button
            type="button"
            className={sortDirection === 'desc' ? 'sort-button active' : 'sort-button'}
            onClick={() => setSortDirection('desc')}>
            Desc
          </button>
          </div>
        </div>
        <div>
          <h2>Votre collection</h2>
          <p>
            {collection.count} carte{collection.count > 1 ? 's' : ''}
            {<> — valeur totale estimée : {collection.totalValueLabel}</>}
          </p>
        </div>
        <div className="view-mode-buttons">
          <button
            type="button"
            className={viewMode === 'list' ? 'sort-button active' : 'sort-button'}
            onClick={() => setViewMode('list')}>
            Liste
          </button>
          <button
            type="button"
            className={viewMode === 'images' ? 'sort-button active' : 'sort-button'}
            onClick={() => setViewMode('images')}>
            Images
          </button>
          <button type="button" className="ghost-button" onClick={onReset}>Vider la liste</button>
          </div>
        </div>
      {viewMode === 'list' ? (

        <ul>
        {sortedGroups.map((group) => {
         const { card, quantity, unitPriceLabel, totalPriceLabel } = group;
          return (
          <li key={group.id} className="collection-item">
            <div className="collection-main-info">
              <span className="collection-name">{card.name}</span>

              <div className="collection-card-details">
                <span className={`card-category-badge ${getCardCategoryClass(card)}`}>
                  {card.categoryLabel}
                </span>

                <span className="type-detail-badge">
                  {card.displayType}
                </span>

                {card.isMonster && card.attribute && (
                  <span className="attribute-badge">
                    Attribut : {card.attribute}
                  </span>
                )}

                {card.isMonster && card.race && (
                  <span className="attribute-badge">
                    Type : {card.race}
                  </span>
                )}

                {card.isMonster && Number.isFinite(card.level) && (
                  <span className="attribute-badge">
                    LEVEL : {card.level}
                  </span>
                )}

                {card.isMonster && Number.isFinite(card.linkval) && (
                  <span className="attribute-badge">
                    LINK : {card.linkval}
                  </span>
                )}

                {card.isMonster && Number.isFinite(card.scale) && (
                  <span className="attribute-badge">
                    SCALE : {card.scale}
                  </span>
                )}

                {card.isMonster && Number.isFinite(card.atk) && (
                  <span className="attribute-badge">
                    ATK : {card.atk}
                  </span>
                )}

                {card.isMonster && Number.isFinite(card.def) && (
                  <span className="attribute-badge">
                    DEF : {card.def}
                  </span>
                )}
              </div>
            </div>

             <span className="quantity-badge">
              x{quantity}
            </span>

            <span className="rarity-badge">
              {card.rarity}
            </span>

              <span className="price-badge" title={card.priceSource}>
                {card.priceLabel}
              </span>
          </li>
          );
        })}
      </ul>
      ) : (
      <div className="collection-image-grid">
        {sortedGroups.map((group) => (
        <CollectionImageCard key={group.id} group={group} />
      ))}
    </div>
      )}     
    </section>
  );
}

function sortCollectionGroups(groups, sortKey, sortDirection) { //Fonction de tri
  const direction = sortDirection === 'asc' ? 1 : -1;

  return [...groups].sort((a, b) => {
    const valueA = getSortableValue(a, sortKey);
    const valueB = getSortableValue(b, sortKey);

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * direction;
    }

    return String(valueA).localeCompare(String(valueB), 'fr', {
      sensitivity: 'base',
      numeric: true,
    }) * direction;
  });
}

function getSortableValue(group, sortKey) {
  switch (sortKey) {
    case 'name':
      return group.card.name;

    case 'category':
      return group.card.categoryLabel;

    case 'type':
      return group.card.displayType;

    case 'attribute':
      return group.card.attribute || '';

    case 'quantity':
      return group.quantity;

    case 'rarity':
      return RARITY_ORDER[group.card.rarity] ?? 0;

    case 'unitPrice':
      return group.unitPrice;

    default:
      return group.card.name;
  }
}

function CollectionImageCard({ group }) {
  const { card, quantity } = group;

  return (
    <article className="collection-image-card">
      <img
        src={card.image}
        alt={card.name}
        className="collection-card-image"
        loading="lazy"
      />

      <div className="collection-card-quantity-overlay">
        x{quantity}
      </div>
    </article>
  );
}

