import { Card } from './Card.js';

export class CardList {
  constructor(cards = []) {
    this.cards = cards;
  }

  static fromApi(apiCards = []) {
    return new CardList(apiCards.map((apiCard) => Card.fromApi(apiCard)));
  }

  static fromApiForSet(apiCards = [], setName) {
    const cards = apiCards.flatMap((apiCard) => {
      const matchingSets =
        apiCard.card_sets?.filter((cardSet) => cardSet.set_name === setName) ?? [];

      return matchingSets.map((cardSet) => Card.fromApi(apiCard, cardSet));
    });

    return new CardList(cards);
  }

  get all() {
    return this.cards;
  }

  get count() {
    return this.cards.length;
  }

  get isEmpty() {
    return this.cards.length === 0;
  }

  filterByRarity(rarity) {
    return new CardList(this.cards.filter((card) => card.rarity === rarity));
  }

  excludeIds(ids) {
    return new CardList(this.cards.filter((card) => !ids.has(card.id)));
  }

  pickRandom() {
    if (this.isEmpty) {
      throw new Error('Impossible de choisir une carte dans une liste vide.');
    }

    const randomIndex = Math.floor(Math.random() * this.cards.length);

    return this.cards[randomIndex];
  }

  pickRandomUnique(quantity) {
    const availableCards = [...this.cards];
    const selectedCards = [];

    while (selectedCards.length < quantity && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const [card] = availableCards.splice(randomIndex, 1);

      selectedCards.push(card);
    }

    return selectedCards;
  }
}