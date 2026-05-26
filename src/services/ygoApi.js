import { CardList } from '../models/CardList.js';

const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const cache = new Map();
const ALL_CARDS_CACHE_KEY = '__all_cards__';

export async function fetchCardsBySet(setName) {
  if (cache.has(setName)) {
    return cache.get(setName);
  }

  const urlsToTry = [
    buildUrlWithPlus(setName),
    buildUrlWithPercentEncoding(setName),
  ];

  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const cardList = await fetchCardListFromUrl(url, setName);

      cache.set(setName, cardList);
      return cardList;
    } catch (error) {
      lastError = error;
      console.warn(`Échec avec l'URL "${url}"`, error);
    }
  }

  console.warn(
    `Fallback global utilisé pour "${setName}" après échec des URLs cardset.`,
    lastError
  );

  const allCards = await fetchAllCards();
  const cardList = CardList.fromApiForSet(allCards.all, setName);

  if (cardList.isEmpty) {
    throw new Error(`Aucune carte trouvée pour le set "${setName}".`);
  }

  cache.set(setName, cardList);
  return cardList;
}

export async function fetchAllCards() {
  if (cache.has(ALL_CARDS_CACHE_KEY)) {
    return cache.get(ALL_CARDS_CACHE_KEY);
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const cardList = CardList.fromApi(json.data);
  cache.set(ALL_CARDS_CACHE_KEY, cardList);
  return cardList;
}

async function fetchCardListFromUrl(url, setName) {
  console.log('Fetching set:', setName);
  console.log('URL testée:', url);

  const response = await fetch(url);

  if (!response.ok) {
    console.warn(
      `Réponse HTTP ${response.status} ${response.statusText} pour "${setName}", tentative de lecture du JSON.`
    );
  }

  let json;

  try {
    json = await response.json();
  } catch {
    throw new Error(
      `Réponse API illisible pour "${setName}" avec l'URL "${url}"`
    );
  }

  if (!json?.data) {
    throw new Error(
      `Aucune donnée exploitable pour "${setName}" avec l'URL "${url}"`
    );
  }

  const cardList = CardList.fromApiForSet(json.data, setName);

  if (cardList.isEmpty) {
    throw new Error(`Aucune carte trouvée pour le set "${setName}"`);
  }

  return cardList;
}

function buildUrlWithPlus(setName) {
  const params = new URLSearchParams({ cardset: setName });

  return `${API_URL}?${params.toString()}`;
}

function buildUrlWithPercentEncoding(setName) {
  return `${API_URL}?cardset=${encodeURIComponent(setName)}`;
}