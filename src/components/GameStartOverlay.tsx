import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import "../assets/GameStartOverlay.sass";
import TheGame from "../TheGame";
import { animated, easings, useSpring } from "react-spring";

export function GameStartOverlay(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const [overlayHide, setOverlayHide] = useState(false);
  const disablePlayerButtons: string = gameStore.players.length
  ? "disabled"
  : "";

  const setPlayerCount = (count: number): void => {
    if (gameStore.initialized) return;
    let game = { ...gameStore };
    //init players
    game.players = TheGame.initPlayers(count);
    game = TheGame.givePlayersCards(game);
    setOverlayHide(true);
    setTimeout(()=>{
      game.initialized = true;
      setGameStore(game);
    }, 1700)
    
  };
  const startNewGame = () => {
    let game = TheGame.getNewGame();
    setGameStore(game);
  };

  const styleOverlay = useSpring({
    opacity: overlayHide ? 0: 1,
    y: overlayHide ? window.innerHeight * -1.5: 0,
    config: {duration: 1500, easing: easings.easeInOutExpo},
    delay: 200
  });

  return(
    <animated.div style={styleOverlay} className="game-start-overlay d-flex flex-column justify-content-center">
      <div className="container ">
        <div className="d-flex justify-content-center align-items-center flex-column pe-2">
          {!gameStore.players.length ? 
          <>
          <p className="h2">Select the number of players</p>
          <div className="btn-group" role="group" aria-label="Basic example">

            {[4,5,6].map(playerCount => (
              <button
                type="button"
                className={"btn btn-primary " + disablePlayerButtons}
                onClick={() => {
                  setPlayerCount(playerCount);
              }}
              >{playerCount}</button>
              )
              )}
            </div>
            </>:<div className="d-flex justify-content-center align-items-center flex-column">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              startNewGame();
            }}
            title="Start New Game"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div> }
          
          
          
        </div>
        
      </div>
    </animated.div>
  )
}