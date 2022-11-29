import { useContext } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { Game, Player, PlayerCard } from "../types";
import CardHelper from "../utilities/CardHelper";
import { PlayerDecision } from "../utilities/PlayerDecision";

export function RefillStack() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);

  const finishMove = () => {
    let game: Game = { ...gameStore };
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
      const otherPlayers = game.players.filter(
        (p: Player, playerID: number) => playerID !== 0
      );

      otherPlayers.forEach((player: Player, playerIndex: number) => {
        const minimumCardsToPlay: number = game.refillStack.length ? 2 : 1;
        const plDecision = new PlayerDecision(player, game);
        const bestPos = plDecision.getBestPossibility(minimumCardsToPlay);
        console.log("PLAYER ", playerIndex, " --- ", bestPos);
        bestPos.way.forEach((way) => {
          if (
            TheGame.isCardAllowed(way.hand.value, game.stacks[way.stack_id])
          ) {
            game.players[playerIndex + 1].cards = player.cards.filter(
              (card) => card !== way.hand
            );
            game.stacks[way.stack_id].cards.push(way.hand.value);

            //setGameStore(game);
            console.log(
              `Player ${playerIndex + 1} wanna play Card ${
                way.hand.value
              } to Stack ${way.stack_id}`
            );
          }
        });
        console.log(`Player ${playerIndex + 1} has played`);
      });
      game.status.allowUserToPlay = true;
      //setGameStore(game);
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
