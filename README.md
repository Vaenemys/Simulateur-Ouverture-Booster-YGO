# Yu-Gi-Oh! Pack Opener Simulator

Pack opener simulator for the Yu-Gi-Oh! Trading Card Game developped in React.

This project is first and formost, a passion project built around an universe that I truly enjoy. 
The goal was to recreate  the excitement behind a booster pack opening in a structured webapp, and flexible enough to handle a large variety of products, opening rules and rarities.
This webapp allows users to open different booster packs, add opened cards into a collection, and simulate rarity mechanics of the Yu-Gi-Oh! Trading Card Game.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm

## Installation

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Project Objectives

The main goal was to blend passion and development around something concrete.
Yu-Gi-Oh! Trading Card Game posseses a rich and complex system of cards, rarities, products, and editions.
This simulator gave me the opportunity to work on an application where business logic occupies a real place : booster generation, rarities handling, collection management, and data processing from an external API.

## Current Features

- Classic booster opening mode.
- Draft mode: open 9 random cards and select one.
- Full random mode: open 9 completely random cards.
- Session-based card collection.
- Automatic duplicate grouping.
- Collection sorting by name, category, type, attribute, quantity, rarity, and price.
- Collection display as a detailed list or as card images.
- Estimated card prices in euros.
- Configurable booster sets through JSON.

## Fixes and improvements so far

- Card names containing special characters, such `&` in `Ash Blossom & Joyous Spring`, are now displayed as regular React text without HTML interpretation.
- Draft mode selection was reworked so that only the intended card is selected.
- The initial idea of using icons for card types and attributes was dropped to avoid copyright concerns. Text badges are used instead.
- Some API calls required different URL encodings depending on the set. This was handled by testing multiple encodings and caching successful results.
- Duplicate cards can no longer appear inside the same booster.
- Duplicate cards in the collection are now grouped with a quantity counter.
- Cards with values such as ATK: 0 or DEF: 0 are displayed correctly.
- Booster rarity generation was refactored to better support different product types.

## Adding a booster set

Not every Yu-Gi-Oh set is currently included. To add a new set, add an entry in:

```txt
src/data/boosterSets.json
```

Example :

```json
{
  "id": "dabl",
  "label": "Darkwing Blast",
  "apiName": "Darkwing Blast",
  "cardsPerBooster": 9,
  "featuredRarityReplace": "Super Rare",
  "baseSlots": {
    "Common": 8,
    "Super Rare": 1
  },
  "featuredOpenings": {
    "ultra": [4, 8],
    "secret": [12]
  },
  "randomDrops": {
    "Starlight Rare": {
      "oneIn": 576
    }
  }
}
```
Princpal properties : 

- baseSlots : The usual raritiy distribution of this booster
- featuredOpenings : Pack openings that features a superior rarity
- featuredRarityReplace : Represent which rarity is replaced during a featured opening
- Random Drops : Special rarities that can appear randomly, such as Starlight Rare or Quarter Century Secret Rare
- rarityMode : "fixed" : Optional flag used for products with fixed rarity distributions, such as Tin Box Mega Packs.

## Known Limitations

- Prices are only estimates provided by the API
- Some booster sets may return API issues and are currently flagged as unavailable
- Drop rate are configured manually to approximate which rarities you are guarranted to drop in a 24 boosters display
- Card data and pictures depends on YGOPRODeck

## Area for improvement

- Load every card once and filter them locally
- Add persistent cache storage to keep the collection after refreshing the page
- Add a search bar for the collection
- Add an advanced filter tabs
- Add opening statistics
- Add a favorite system
- Add the possibility to export the collection
- Improve responsiveness on mobile devices
- Add an animation for booster opening
- Add a special animation for high rarities
## Project Structure

```txt
src/
  components/
    BoosterGrid.jsx
    CardItem.jsx
    SetSelector.jsx
  data/
    boosterSets.json
  models/
    Booster.js
    Card.js
    CardList.js
  services/
    booster.js
    ygoApi.js
  App.jsx
  main.jsx
  styles.css
```
Happy Opening! :)