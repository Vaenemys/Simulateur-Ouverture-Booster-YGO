import CardItem from './CardItem.jsx';

export default function BoosterGrid({
  cards,
  selectedCardInstanceId,
  onChoose,
  canChooseCard = false,
  showMarketInfo = true,
}) {
  if (cards.length === 0) {
    return <p className="empty-state">Aucune ouverture lancée pour le moment.</p>;
  }

  return (
    <section className="booster-grid" aria-label="Cartes de l'ouverture">
      {cards.map((card) => (
        <CardItem
          key={card.instanceId}
          card={card}
          onChoose={onChoose}
          isChosen={selectedCardInstanceId === card.instanceId}
          canChooseCard={canChooseCard}
          showMarketInfo={showMarketInfo}
        />
      ))}
    </section>
  );
}
