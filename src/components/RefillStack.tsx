import { useContext } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { Game, Player, PlayerCard } from "../types";
import CardHelper from "../utilities/CardHelper";
import { PlayerDecision } from "../utilities/PlayerDecision";

export function RefillStack() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);

  /**
   *  FINISH MOVE
   */
  const finishMove = () => {
    let game: Game = { ...gameStore };
    const isAllowed = TheGame.isAllowedFinishMove(game);
    if (isAllowed) {
      game.status.allowUserToPlay = false;

      //Check if Player have won the game
      const winStatus = TheGame.checkPlayersAreWinner(game);
      if(winStatus) console.log("Ihr habt gewonnen!");
      //Draw new cards
      if(game.refillStack.length) setGameStore(TheGame.drawNewCards(0, game));

      //let the other player play!
      const otherPlayers = game.players.filter(
        (p: Player, playerID: number) => playerID !== 0
      );
      
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
          } else {
            alert("GAME OVER");
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
        className={gameStore.status.allowUserToPlay? refillStackClassNames+" is-allowed" : refillStackClassNames }
        onClick={() => {
          finishMove();
        }}
      >
        <h1>End</h1>
        <h2>move</h2>
      </div>
    </>
  );
}
const refillStackClassNames = "refill-stack d-flex flex-column align-items-center";
