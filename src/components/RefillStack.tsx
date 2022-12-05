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
      setGameStore(TheGame.drawNewCards(0, game));

      //let the other player play!
      const otherPlayers = game.players.filter(
        (p: Player, playerID: number) => playerID !== 0
      );
       
      const minimumCardsToPlay: number = game.refillStack.length ? 2 : 1;
      
      otherPlayers.forEach((player: Player, playerIndex: number) => {
        const minimumCardsToPlay: number = game.refillStack.length ? 2 : 1;
        if(player.cards.length){
          const plDecision = new PlayerDecision(player, game);
          const bestPos = plDecision.getBestPossibility(minimumCardsToPlay);
          if(bestPos){
            bestPos.way.forEach((way) => {
              if (
                TheGame.isCardAllowed(way.hand, game.stacks[way.stack_id])
              ) {
                game.players[playerIndex + 1].cards = player.cards.filter(
                  (card) => card.value !== way.hand
                );
                game.stacks[way.stack_id].cards.push(way.hand);
                setGameStore(game);
                console.log(
                  `Player ${playerIndex + 1} wanna play Card ${
                    way.hand
                  } to Stack ${way.stack_id}`
                );
              }
            });
            setGameStore(TheGame.drawNewCards(playerIndex + 1, game));
          }        
      }
        
      });

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
