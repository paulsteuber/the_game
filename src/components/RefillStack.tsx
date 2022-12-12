import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import "../assets/RefillStack.sass";
import { Game, Player, PlayerCard } from "../types";
import CardHelper from "../utilities/CardHelper";
import { PlayerDecision } from "../utilities/PlayerDecision";

export function RefillStack() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const [test, setTest] = useState(1);

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
      if (winStatus) console.log("Ihr habt gewonnen!");
      //Draw new cards
      if (game.refillStack.length) setGameStore(TheGame.drawNewCards(0, game));
      //set lastMoveCardCount of every Player
      game.players = game.players.map((pl) => {
        pl.lastMoveCardsCount = pl.cards.length;
        return pl;
      });

      //let the other player play!
      const otherPlayers = game.players.filter(
        (p: Player, playerID: number) => playerID !== 0
      );
        
      const letOtherPlayerPlay = (player: Player, playerIndex: number) =>{
          setTimeout(()=>{
            const minimumCardsToPlay: number = game.refillStack.length ? 2 : 1;
            if (player.cards.length) {
              const plDecision = new PlayerDecision(player, game);
              const bestPos = plDecision.getBestPossibility(minimumCardsToPlay);
              if (bestPos) {
                bestPos.way.forEach((way) => {
                    if (TheGame.isCardAllowed(way.hand, game.stacks[way.stack_id])) {
                      
                      
                      game.players[playerIndex + 1].cards = player.cards.filter(
                        (card) => card.value !== way.hand
                      );
                      game.stacks[way.stack_id].cards.push(way.hand);
                      //setGameStore(game);
                      game = {...gameStore};
                      console.log(
                        `Player ${playerIndex + 1} wanna play Card ${
                          way.hand
                        } to Stack ${way.stack_id}`
                      );
                    }
                });
                setGameStore(TheGame.drawNewCards(playerIndex + 1, game));
                //game = {...gameStore};
              } else {
                game.status.gameOver = true;
                setGameStore(game)
                game = {...gameStore};
                alert("GAME OVER");
              }
            }
          },500 * (1+playerIndex));
          
        
      }
      otherPlayers.forEach((player: Player, playerIndex: number) => {
        letOtherPlayerPlay(player, playerIndex)
      });
      //if user has no cards anymore let the other player play
      if(!game.status.gameOver && game.players[0].cards.length === 0){
        alert("Other Players playing alone");
        while(!game.status.gameOver && TheGame.otherPlayersHaveCards(otherPlayers)){
          otherPlayers.forEach((player: Player, playerIndex: number) => {
            letOtherPlayerPlay(player, playerIndex)
          });
        }
      }


      game.status.allowUserToPlay = true;
      setGameStore(game);
      return;
    }

    console.log("finish is not allowed");
  };
  return (
    <>
      <div
        className={
          gameStore.status.allowUserToPlay
            ? refillStackClassNames + " is-allowed"
            : refillStackClassNames
        }
        onClick={() => {
          finishMove();
        }}
      >
        <p className="fw-bolder h4 text-center">finish move</p>
      </div>
    </>
  );
}
const refillStackClassNames =
  "refill-stack d-flex flex-column align-items-center justify-content-center p-3";
