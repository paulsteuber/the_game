import { useContext } from "react";
import { Game, Player } from "../types";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";

export function Header() {
  const { gameStore, setGameStore } = useContext<any>(GameContext);
 
  const openGameStartOverlay = () => {
    let game = {...gameStore};
    game.status.playerCountOverlayHide = false;
    setGameStore(game);
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3">
      <svg width="100" height="100">
  <rect x="10" y="10" width="80" height="80" rx="10" ry="10" fill="#FECE44"/>
  <polygon points="50,10 65,35 50,60 35,35" fill="black"/>
  <text x="50" y="65" text-anchor="middle" font-size="20" fill="black">The Game</text>
</svg>



        <div className="d-flex justify-content-center align-items-center flex-column">
          <div className="btn-group" role="group" aria-label="Basic example">
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
          </div>
        </div>
    </header>
  );
}
