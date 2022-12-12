import { useContext } from "react";
import { GameContext } from "../GameContext";
import { PlayerCard } from "../types";
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
  return (
    <div className="d-flex justify-content-center align-items-center flex-column user">
      Your Cards
      <div className={allowUserToPlayClass + " d-flex justify-content-center"}>
        {userCardsComponents}
      </div>
    </div>
  );
}
