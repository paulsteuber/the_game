import { useContext, useState} from "react";
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
    let game: Game = gameStore;
    const isAllowed = TheGame.isAllowedFinishMove(game);
    if (isAllowed) {
      game.status.allowUserToPlay = false;
      setGameStore(game);
      game = { ...gameStore };
      

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
        return new Promise((resolve) =>{
          setTimeout(()=>{
            const minimumCardsToPlay: number = game.refillStack.length ? 2 : 1;
            if (player.cards.length) {
              const plDecision = new PlayerDecision(player, game);
              const bestPos = plDecision.getBestPossibility(minimumCardsToPlay);
              if (bestPos) {
                bestPos.way.forEach((way) => {
                    if (TheGame.isCardAllowed(way.hand, game.stacks[way.stack_id])) {
                      setGameStore(TheGame.addHistoryEntry(game, playerIndex+1, way.hand, game.stacks[way.stack_id]))
                      game.players[playerIndex + 1].cards = player.cards.filter(
                        (card) => card.value !== way.hand
                      );
                      game.stacks[way.stack_id].cards.push(way.hand);
                      setGameStore(game);
                      game = {...gameStore};
                      console.log(
                        `Player ${playerIndex + 1} wanna play Card ${
                          way.hand
                        } to Stack ${way.stack_id}`
                      );
                    }
                });
                setGameStore(TheGame.drawNewCards(playerIndex + 1, game));
                game = {...gameStore};
              } else {
                game.status.gameOver = true;
                setGameStore(game)
                game = {...gameStore};
                resolve(true);
              }
            }
            resolve(false);
          },500 * (1+playerIndex));
        });
          
          
        
      }
      async function otherPlayerPlays(){
        for await (const player of otherPlayers) {
          const gameOverStatus = await letOtherPlayerPlay(player, otherPlayers.indexOf(player) );
          if (gameOverStatus) break;
        }
        
        /**
         * 
         * AFTER ALL PLAYERS PLAYED
         */
        const cardsPlayerCanPlay = game.players[0].cards.filter(c => c.stackStatus.a || c.stackStatus.b || c.stackStatus.c || c.stackStatus.d );
        console.log("CARDS PLAYER CAN PLAYER", cardsPlayerCanPlay);
        if(!cardsPlayerCanPlay.length){
          game.status.gameOver = true;
          console.log("GAME OVER XX")
          setGameStore(game)
          game = JSON.parse(JSON.stringify(gameStore));
        }
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


      }
      otherPlayerPlays();
      //if user has cards, but can't play any cards
      
     
      

      
      return;
    }

    console.log("finish is not allowed");
  };

  const howManyCardsToPlay = () => {
    if(gameStore.refillStack.length){
      const diff = gameStore.players[0].cards.length - CardHelper.cardsPerPlayer(gameStore.players.length);
      return 2 + diff;
    }
    const diff =  gameStore.players[0].lastMoveCardsCount - gameStore.players[0].cards.length;
    return diff === 0 ? 1: 0
  }  
  return (
    <>
     <div
        className={
          (gameStore.status.allowUserToPlay
            ? refillStackClassNames + " is-allowed"
            : refillStackClassNames)+" "+(
              howManyCardsToPlay() > 0 ? "not-enough-cards-played": ""
            )+(gameStore.refillStack.length === 0 ? " empty-refill-stack": "")
        }
        onClick={() => {
          finishMove();
        }}
      >
        {gameStore.status.allowUserToPlay ? (
        <>
          {howManyCardsToPlay() > 0 ? <p className="fw-bolder h6 text-center">You must play {howManyCardsToPlay()} card</p>: <p className="fw-bolder h4 text-center">finish move</p>}
          
          <span>{gameStore.refillStack.length}</span>
        </>
        ) : (
          <div className="loading">
          {[...Array(3)].map(() =>(<div className="spinner-grow spinner-grow-sm mx-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>))}
          </div>
        )}
      </div>
    </>
  );
}
const refillStackClassNames =
  "refill-stack d-flex flex-column align-items-center justify-content-center p-3";
