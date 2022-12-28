import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import "../assets/GameOverOverlay.sass";

import TheGame from "../TheGame";
import { animated, easings, useSpring } from "react-spring";

export function GameOverOverlay(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  
  const styleOverlay = useSpring({
    opacity: gameStore.status.gameOver || gameStore.status.gameWin ?  1 : 0,
    y: gameStore.status.gameOver || gameStore.status.gameWin ? 0 : window.innerHeight * -1.5,
    config: {duration: 500, easing: easings.easeInOutExpo},
    delay: 500
  });
  const openGameStartOverlay = () => {
    let game = TheGame.getNewGame();
    game.status.playerCountOverlayHide = false;
    setGameStore(game);
  };
  return(
    <animated.div style={styleOverlay} className="game-over-overlay d-flex flex-column justify-content-center align-items-center">
      <h1>{gameStore.status.gameOver ? "GAME OVER" :""}
          {gameStore.status.gameWin ? "WIN" :""}</h1>
          
          {gameStore.status.gameWin || gameStore.status.gameOver ?
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                openGameStartOverlay();
              }}
              title="Start New Game"
            > Start New Game?
              <i className="ms-2 bi bi-arrow-counterclockwise"></i>
            </button>
            : ""}
    </animated.div>
  )
}