import { useContext } from "react";
import { useTransition, animated } from "react-spring";
import { GameContext } from "../GameContext";
import { PlayerCard } from "../types";
import { UserCard } from "./UserCard";

export function User() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const userCards = gameStore.players[0].cards;

  const transition = useTransition(true, {
    from: { opacity: 0, scale: 1.1, y: 100 },
    enter: { opacity: 1, scale: 1, y: 0 },
    leave: { opacity: 0, scale: 0, y: 100 },
    delay: 200,
  });
  const userCardsComponents = userCards.map(
    (card: PlayerCard, cardIndex: number) => {
      return transition((style) => (
        <animated.div key={card.value} style={style}>
          <UserCard key={card.value} {...card} />
        </animated.div>
      ));
    }
  );
  const allowUserToPlayClass = gameStore.status.allowUserToPlay
    ? ""
    : "play-forbidden";
  return (
    <div className="d-flex justify-content-center align-items-center flex-column user">
      User Cards
      <div className={allowUserToPlayClass + " d-flex justify-content-center"}>
        {userCardsComponents}
      </div>
    </div>
  );
}
