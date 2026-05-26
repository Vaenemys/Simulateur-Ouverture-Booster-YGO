export class CardCollection {
  constructor(cards = []) {
    this.cards = cards;
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

  get totalValue() {
    return this.cards.reduce((total, card) => total + card.priceEur, 0);
  }

  get totalValueLabel() {
    if (!Number.isFinite(this.totalValue) || this.totalValue <= 0) {
      return 'Prix indisponible';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.totalValue);
  }

  get groupedCards() {
    const groups = new Map();

    this.cards.forEach((card) => {
        const id = card.collectionKey || `${card.id}-${card.setCode}-${card.rarity}-${card.priceEur}`;

        if (!groups.has(id)) {
            groups.set(id, {
            id,
            card,
            quantity: 1,
            totalPrice: card.priceEur,
            });
        return;
        }

        const group = groups.get(id);

        group.quantity += 1;
        group.totalPrice += card.priceEur;
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      unitPrice: group.card.priceEur,
      unitPriceLabel: group.card.priceLabel,
      totalPriceLabel: new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(group.totalPrice),
    }));
  }

  addMany(cards) {
    const cardsWithInstanceIds = cards.map((card) => card.withInstanceId());

    return new CardCollection([
      ...cardsWithInstanceIds,
      ...this.cards,
    ]);
  }
  clear() {
    return new CardCollection();
  }
}