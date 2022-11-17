import { useState, useMemo, useEffect } from "react";
import { GameContext } from "./GameContext";
import './assets/App.sass'
import { Header } from "./components/Header";
import {Game}  from "./types";
import TheGame from "./TheGame";
import { User } from "./components/User";
import { Table } from "./components/Table";

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
        <Header/>
        {gameStore.players.length &&
        <>
          <Table/>
          <User/>
        </>
        }
        <aside className="state">
          initialized : {gameStore.initialized ? "true" : "false"}
          <br></br>
          players: {JSON.stringify(gameStore.players)}
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

        </aside>
      </div>
    </GameContext.Provider>
  )
}

export default App
