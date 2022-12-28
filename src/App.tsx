import { useState, useMemo, useEffect } from "react";
import { GameContext } from "./GameContext";
import "./assets/App.sass";
import { Header } from "./components/Header";
import { Game } from "./types";
import TheGame from "./TheGame";
import { User } from "./components/User";
import { IntroOverlay } from "./components/IntroOverlay";
import { Table } from "./components/Table";
import { OtherPlayers } from "./components/OtherPlayers";
import { GameStartOverlay } from "./components/GameStartOverlay";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { GameHistory } from "./components/GameHistory";

function App() {
  /**STORE */
  const game: Game = TheGame.getNewGame();
  const [gameStore, setGameStore] = useState<Game>(game);
  const valueGameStore: any = useMemo<any>(
    () => ({ gameStore, setGameStore }),
    [gameStore, setGameStore]
  );
  /*
   * GAME
   */
  return (
    <GameContext.Provider value={valueGameStore}>
      <div className="App" id="app">
        <IntroOverlay />
        <GameStartOverlay />
        <GameOverOverlay/>
        <Header />
        <div className="d-flex">
          {gameStore.players && gameStore.players.length && (
            <div className="main-game d-flex flex-column">
              <OtherPlayers/>
              <Table />
              <User />
            </div>
            
          )}
          <div className="side d-flex flex-column">
            <GameHistory/>
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default App;
