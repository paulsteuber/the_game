import { useContext } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { PlayerCard } from "../types";
import CardHelper from "../utilities/CardHelper";

export function RefillStack() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);

  const finishMove = () => {
    let game = { ...gameStore };
    const isAllowed = TheGame.isAllowedFinishMove(game);
    const cardsPerPlayer = CardHelper.cardsPerPlayer(game.players.length);
    if (isAllowed) {
      game.status.allowUserToPlay = false;
      //Draw new cards
      const usersCardsCount = game.players[0].cards.length;
      for (let i = 0; i < cardsPerPlayer - usersCardsCount; i++) {
        if (game.refillStack.length) {
          const drawnCard: PlayerCard = {
            value: game.refillStack.shift(),
            stackStatus: { a: true, b: true, c: true, d: true },
          };
          game.players[0].cards.push(drawnCard);
        }
      }
      game.players[0].cards = CardHelper.sortCards(game.players[0].cards);

      //refresh card status
      game.players = TheGame.refreshPlayerCardsStatus(
        game.players,
        game.stacks
      );
      //let the other player play!
      TheGame.otherPlayersPlay(game);
      game.status.allowUserToPlay = true;
      setGameStore(game);
      return;
    }

    console.log("finish is not allowed");
  };
  return (
    <>
      <div
        className="refill-stack d-flex flex-column align-items-center"
        onClick={() => {
          finishMove();
        }}
      >
        <h1>Refill</h1>
        <h2>Stack</h2>
      </div>
    </>
  );
}
