export class Card {
  constructor(apiCard, selectedSet = null) {
    this.id = apiCard.id;
    this.name = apiCard.name;
    this.type = apiCard.type ?? '';
    this.desc = apiCard.desc ?? '';
    this.race = apiCard.race ?? '';
    this.attribute = apiCard.attribute ?? '';
    this.archetype = apiCard.archetype ?? '';
    this.atk = apiCard.atk ?? null;
    this.def = apiCard.def ?? null;
    this.level = apiCard.level ?? null;
    this.scale = apiCard.scale ?? null;
    this.linkval = apiCard.linkval ?? null;
    this.linkmarkers = apiCard.linkmarkers ?? [];

    this.images = apiCard.card_images ?? [];
    this.image = this.images[0]?.image_url_small ?? this.images[0]?.image_url ?? '';

    this.rawPrices = apiCard.card_prices?.[0] ?? null;
    this.rawSets = apiCard.card_sets ?? [];
    this.selectedSet = selectedSet ?? this.rawSets[0] ?? null;

    this.instanceId = apiCard.instanceId ?? null;
  }

  static fromApi(apiCard, selectedSet = null) {
    return new Card(apiCard, selectedSet);
  }

  get rarity() {
    return this.selectedSet?.set_rarity ?? 'Rareté inconnue';
  }

  get setName() {
    return this.selectedSet?.set_name ?? 'Carte aléatoire';
  }

  get setCode() {
    return this.selectedSet?.set_code ?? null;
  }

  get priceEur() {
    return (
      this.parsePrice(this.selectedSet?.set_price)
      ?? this.parsePrice(this.rawPrices?.cardmarket_price)
      ?? 0
    );
  }

  get priceLabel() {
    if (!Number.isFinite(this.priceEur) || this.priceEur <= 0) {
      return 'Prix indisponible';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.priceEur);
  }

  get priceSource() {
    return this.parsePrice(this.selectedSet?.set_price) !== null
      ? 'Prix édition'
      : 'Prix Cardmarket global';
  }

  get isSpell() {
    return this.type === 'Spell Card';
  }

  get isTrap() {
    return this.type === 'Trap Card';
  }

  get isMonster() {
    return !this.isSpell && !this.isTrap;
  }

  get spellTrapSubtype() {
    if (!this.isSpell && !this.isTrap) {
      return '';
    }

    if (!this.race || this.race === 'Normal') {
      return 'None';
    }

    return this.race;
  }

  get displayType() {
    if (this.isSpell) {
      return this.spellTrapSubtype === 'None'
        ? 'Spell Card'
        : `${this.spellTrapSubtype} Spell Card`;
    }

    if (this.isTrap) {
      return this.spellTrapSubtype === 'None'
        ? 'Trap Card'
        : `${this.spellTrapSubtype} Trap Card`;
    }

    return this.type;
  }

  get categoryLabel() {
    if (this.isSpell) {
      return 'Spell';
    }

    if (this.isTrap) {
      return 'Trap';
    }

    return 'Monster';
  }

  get typeBadgeLabel() {
    if (this.isMonster) {
      return this.attribute || this.type;
    }

    return this.displayType;
  }

  get collectionId() {
    return [
      this.id,
      this.setCode ?? 'no-set-code',
      this.rarity,
      this.priceEur,
    ].join('-');
  }

  belongsToSet(setName) {
    return this.rawSets.some((cardSet) => cardSet.set_name === setName);
  }

  withInstanceId() {
    const instance = new Card(this.toApiShape(), this.selectedSet);
    instance.instanceId = `${this.id}-${crypto.randomUUID()}`;
    return instance;
  }

  toApiShape() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      desc: this.desc,
      race: this.race,
      attribute: this.attribute,
      archetype: this.archetype,
      atk: this.atk,
      def: this.def,
      level: this.level,
      scale: this.scale,
      linkval: this.linkval,
      linkmarkers: this.linkmarkers,
      card_images: this.images,
      card_prices: this.rawPrices ? [this.rawPrices] : [],
      card_sets: this.rawSets,
      instanceId: this.instanceId,
    };
  }

  parsePrice(value) {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const price = Number.parseFloat(String(value).replace(',', '.'));

    return Number.isFinite(price) && price > 0 ? price : null;
  }
}