const RARITY_LABELS = {
  super: 'Super Rare',
  ultra: 'Ultra Rare',
  secret: 'Secret Rare',
};

export class Booster {
  constructor(cardList, setConfig, openingNumber) {
    this.cardList = cardList;
    this.setConfig = setConfig;
    this.openingNumber = openingNumber;
    this.cards = [];
    this.usedCardIds = new Set();
  }

  open() {
    const slots = this.buildSlots();
    Object.entries(slots).forEach(([rarity, quantity]) => {
      for (let index = 0; index < quantity; index += 1) {
        const card = this.pickCardByRarity(rarity);
        this.addCard(card);
      }
    });

    return this.cards;
  }

    buildSlots() {
    if (!this.setConfig?.baseSlots) {
      throw new Error(
        `Configuration invalide pour "${this.setConfig?.label ?? 'set inconnu'}" : baseSlots est manquant.`
      );
    }

    const slots = { ...this.setConfig.baseSlots };
    const rarityMode = this.setConfig.rarityMode ?? 'upgrade';

    if (rarityMode === 'fixed') {
      return slots;
    }

    const featuredRarity = this.resolveFeaturedRarity();

    if (!featuredRarity) {
      return slots;
    }

    const featuredRarityReplace = this.setConfig.featuredRarityReplace;

    if (!featuredRarityReplace || (slots[featuredRarityReplace] ?? 0) <= 0) {
      return slots;
    }

    slots[featuredRarityReplace] -= 1;

    if (slots[featuredRarityReplace] <= 0) {
      delete slots[featuredRarityReplace];
    }

    slots[featuredRarity] = (slots[featuredRarity] ?? 0) + 1;

    return slots;
  }

  resolveFeaturedRarity() {
    const guaranteedRarity = this.getGuaranteedRarity();

    if (guaranteedRarity) {
      return guaranteedRarity;
    }

    return this.getRandomDropRarity();
  }

  getGuaranteedRarity() {
    const featuredOpenings = this.setConfig.featuredOpenings ?? {};
    const match = Object.entries(featuredOpenings).find(([, openings]) => openings.includes(this.openingNumber));

    return match ? RARITY_LABELS[match[0]] : null;
  }

  getRandomDropRarity() {
    const randomDrops = this.setConfig.randomDrops ?? {};

    for (const [rarity, dropConfig] of Object.entries(randomDrops)) {
      const oneIn = dropConfig.oneIn;

      if (!oneIn || oneIn <= 0) {
        continue;
      }

      const hasDropped = Math.floor(Math.random() * oneIn) === 0;

      if (hasDropped) {
        return rarity;
      }
    }

    return null;
  }

  pickCardByRarity(rarity) {
    const availableCards = this.cardList.filterByRarity(rarity).excludeIds(this.usedCardIds);
    return availableCards.pickRandom();
  }

  addCard(card) {
    if (this.usedCardIds.has(card.id)) {
      throw new Error(`Doublon détecté dans le booster : "${card.name}" est déjà présent.`);
    }

    this.cards.push(card);
    this.usedCardIds.add(card.id);
  }
}
