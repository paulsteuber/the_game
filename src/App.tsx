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
        <Header />
        {gameStore.players.length && (
          <>
            <OtherPlayers/>
            <Table />
            <User />
          </>
        )}
        <aside className="state">
          initialized : {gameStore.initialized ? "true" : "false"}
          gameStatus : {JSON.stringify(gameStore.status)}
          
          <br></br>
          refillStack: {JSON.stringify(gameStore.refillStack)}
          <br></br>
          stacks A {JSON.stringify(gameStore.stacks[0].cards)}
          <br></br>
          stacks B {JSON.stringify(gameStore.stacks[1].cards)}
          <br></br>
          stacks C {JSON.stringify(gameStore.stacks[2].cards)}
          <br></br>
          stacks D {JSON.stringify(gameStore.stacks[3].cards)}
          <br></br>
          played Cards {(gameStore.stacks[0].cards.length+gameStore.stacks[1].cards.length+gameStore.stacks[2].cards.length+gameStore.stacks[3].cards.length -4)}
        </aside>
      </div>
    </GameContext.Provider>
  );
}

export default App;
