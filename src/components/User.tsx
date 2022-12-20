import { useContext } from "react";
import { GameContext } from "../GameContext";
import { PlayerCard } from "../types";
import CardHelper from "../utilities/CardHelper";
import { UserCard } from "./UserCard";

export function User() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const userCards = gameStore.players[0].cards;

  
  const userCardsComponents = userCards.map(
    (card: PlayerCard, cardIndex: number) => <UserCard key={card.value} {...{card: card, cardIndex: cardIndex}}  />
  );
  const allowUserToPlayClass = gameStore.status.allowUserToPlay
    ? ""
    : "play-forbidden";

  const howManyCardsToPlay = () => {
    if(gameStore.refillStack.length){
      const diff = gameStore.players[0].cards.length - CardHelper.cardsPerPlayer(gameStore.players.length);
      return 2 + diff;
    }
    const diff =  gameStore.players[0].lastMoveCardsCount - gameStore.players[0].cards.length;
    return diff === 0 ? 1: 0
  }  
  return (
    <div className="d-flex justify-content-center align-items-center flex-column user">
      Your Cards
      <div className="how-many-cards-to-play">{howManyCardsToPlay() > 0 ? howManyCardsToPlay(): ""}</div>
      <div className={allowUserToPlayClass + " d-flex justify-content-center"}>
        {userCardsComponents}
      </div>
    </div>
  );
}
