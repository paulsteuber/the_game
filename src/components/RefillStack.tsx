import { useContext } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import CardHelper from "../utilities/CardHelper";

export function RefillStack(){
  const { gameStore, setGameStore  } = useContext<any>(GameContext);

  const finishMove = () => {
    let game = {...gameStore};
    const isAllowed = TheGame.isAllowedFinishMove(game);
    const cardsPerPlayer = CardHelper.cardsPerPlayer(game.players.length);
    if(isAllowed){
      //Draw new cards
      const usersCardsCount = game.players[0].cards.length;
      for (let i = 0; i < cardsPerPlayer-usersCardsCount; i++){
        if(game.refillStack.length){
          const drawnNumber = game.refillStack.shift();
          game.players[0].cards.push(drawnNumber);
        }
      }
      game.players[0].cards = CardHelper.sortCards(game.players[0].cards);
      //let the other player play!
      TheGame.otherPlayerPlay(game);
      setGameStore(game);
      return;
    }
    
    console.log("finish is not allowed");
  }
  return (
    <>
      <div className="refill-stack d-flex flex-column align-items-center" onClick={()=>{finishMove()}}>
        <h1>Refill</h1>
        <h2>Stack</h2>
      </div>
    </>
  )
}