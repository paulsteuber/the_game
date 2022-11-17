import { useState, useMemo, useEffect } from "react";
import { GameContext } from "./GameContext";
import './assets/App.sass'
import { Header } from "./components/Header";
import { Game } from "./types";
import { getEmptyGame } from "./Game";

function App() {
  /**STORE */
  const game: Game = getEmptyGame();
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
        <Header/>
        {JSON.stringify(gameStore)}
      </div>
    </GameContext.Provider>
  )
}

export default App
