import { Booster } from '../models/Booster.js';
import { CardList } from '../models/CardList.js';

export function generateBooster(cards, setConfig, openingNumber) {
  const cardList = cards instanceof CardList ? cards : new CardList(cards);
  const booster = new Booster(cardList, setConfig, openingNumber);

  return booster.open();
}

export function generateRandomSelection(cards, quantity = 9) {
  const cardList = cards instanceof CardList ? cards : new CardList(cards);

  return cardList.pickRandomUnique(quantity);
}

export function addInstanceIds(cards) {
  return cards.map((card) => card.withInstanceId());
}

export function getNextOpeningNumber(currentOpeningNumber) {
  return currentOpeningNumber >= 12 ? 1 : currentOpeningNumber + 1;
}
