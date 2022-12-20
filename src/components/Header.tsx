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
