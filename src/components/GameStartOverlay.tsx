import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import "../assets/GameStartOverlay.sass";
import TheGame from "../TheGame";
import { animated, easings, useSpring } from "react-spring";

export function GameStartOverlay(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const disablePlayerButtons: string = gameStore.players.length
  ? "disabled"
  : "";

  const setPlayerCount = (count: number): void => {
    if (gameStore.initialized) return;
    let game = {...gameStore};
    game.status.playerCountOverlayHide = true;
    setGameStore(game)
    game = {...gameStore};
    //init players
    game.players = TheGame.initPlayers(count);
    
    game = TheGame.givePlayersCards(game);
    game.initialized = true;
    setTimeout(()=>{
      setGameStore(game);
    }, 1000)
    
  };
  const startNewGame = () => {
    let game = TheGame.getNewGame();
    setGameStore(game);
  };
  const returnToGame = () => {
    
    let game = { ...gameStore };
    game.status.playerCountOverlayHide = true;
    setGameStore(game)
  }

  const styleOverlay = useSpring({
    opacity: gameStore.status.playerCountOverlayHide ? 0: 1,
    y: gameStore.status.playerCountOverlayHide ? window.innerHeight * -1.5: 0,
    config: {duration: 500, easing: easings.easeInOutExpo},
    delay: 0
  });
  const styleRestart = useSpring({
    opacity: gameStore.players.length ?  1 : 0,
    config: {duration: 500, easing: easings.easeInOutExpo},
    delay: 500
  });
  const stylePlayerCount = useSpring({
    opacity: gameStore.players.length ?  0 : 1,
    config: {duration: 500, easing: easings.easeInOutExpo},
    delay: 500
  });

  return(
    <animated.div style={styleOverlay} className="game-start-overlay d-flex flex-column justify-content-center">
      <div className="container ">
        <div className="d-flex justify-content-center align-items-center flex-column pe-2">
          {!gameStore.players.length ? 
          <animated.div style={stylePlayerCount} className="d-flex flex-column justify-content-center">
          <p className="h2 my-4">Select the number of players</p>
          <div className="d-flex justify-content-center">
          <div className="btn-group" role="group" aria-label="Basic example">

              {[4,5,6].map(playerCount => (
                <button
                  type="button"
                  className={"btn btn-primary btn-lg " + disablePlayerButtons}
                  onClick={() => {
                    setPlayerCount(playerCount);
                }}
                >{playerCount}</button>
                )
                )}
            </div>
          </div>
          
            </animated.div>:
            <animated.div style={styleRestart} className="d-flex justify-content-center align-items-center flex-column">
              <p className="h2 my-4">Do you want to quit the game and restart it?</p>
              <div className="btn-group" role="group" aria-label="Basic example">
                <button
                  type="button"
                  className="btn btn-lg btn-danger"
                  onClick={() => {
                    startNewGame();
                  }}
                  title="Start New Game"
                >
                  <span>Yes, restart it!</span>
                </button>
              </div>
          </animated.div> 
          }
          {gameStore.players.length ? 
          (<animated.div style={styleRestart}>
                <button
                  type="button"
                  className="btn btn-light my-4"
                  onClick={() => {
                    returnToGame();
                  }}
                  title="Return to the game"
                >
                  <span><i className="bi bi-arrow-return-left me-2"></i> No, return to the game!</span>
                </button>
          </animated.div>):""
          }
        </div>
        
      </div>
    </animated.div>
  )
}