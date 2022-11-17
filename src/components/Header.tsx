import { useContext } from "react";
import {Game, Player} from "../types";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";

export function Header(){
  const { gameStore, setGameStore  } = useContext<any>(GameContext);
  const disablePlayerButtons: string = gameStore.players.length ? "disabled" : "";

  const setPlayerCount = (count: number):void => {
    if(gameStore.initialized) return;
    let game = {...gameStore};
    //init players
    game.players = TheGame.initPlayers(count);
    game = TheGame.givePlayersCards(game);
    game.initialized = true;
    setGameStore(game);
  }
  const startNewGame = () => {
    let game = TheGame.getNewGame();
    setGameStore(game);

  }

    return(
        <header className="d-flex justify-content-center align-items-center flex-column p-3">
                <h1 className="fw-bolder">The Game</h1>
                <div className="d-flex justify-content-center align-items-end">
                    <div className="d-flex justify-content-center align-items-center flex-column pe-2">
                        Players
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className={"btn btn-primary "+ disablePlayerButtons} onClick={() =>{setPlayerCount(4)}}>4</button>
                            <button type="button" className={"btn btn-primary "+ disablePlayerButtons} onClick={() =>{setPlayerCount(5)}}>5</button>
                            <button type="button" className={"btn btn-primary "+ disablePlayerButtons} onClick={() =>{setPlayerCount(6)}}>6</button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-danger" onClick={() =>{startNewGame()}} title="Start New Game" ><i className="bi bi-arrow-counterclockwise"></i></button>
                        </div>
                    </div>
                    
                </div>
                
            
        </header>
    )
}