import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { HistoryEntry } from "../types";
import { animated,  useTransition } from "react-spring";

export function GameHistory(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  
  const miniCard = (number: number)=>{
    return (<span className="mini-card p-2">{number}</span>)
  }
  const transition = useTransition(gameStore.history, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: {opacity: 0, y: 10 },
  });

  const historyEntries = gameStore.history.length ? transition((style, entry) => {
    const isTenBagger = TheGame.isCardTenBagger(entry.playedCard, entry.stack);
    const tenBaggerOutput = <>{(entry.stack.up ? " decreased" : " increased")} the stack <span className="stack-name">{TheGame.getStackNameById(entry.stack.id)}</span> by 10 points</> ;
    return(
      <animated.div style={style} className={(isTenBagger? "ten-bagger" :"")+" history-entry"}>
      <p>
        <span className="player-name">{entry.player === 0 ? "You": gameStore.players[entry.player].name}</span>
        {isTenBagger ? <span>{tenBaggerOutput} by playing card {miniCard(entry.playedCard)}</span>: ""}
        {!isTenBagger ? <span> played {miniCard(entry.playedCard)} on the {miniCard(entry.stack.cards.slice(-1)[0])} from stack <span className="stack-name">{TheGame.getStackNameById(entry.stack.id)}</span></span>: ""}
      </p>
    </animated.div>
    );   
  }): "";


  return(
    <aside className="game-history-wrapper d-flex align-items-center flex-column">
      {gameStore.history.length ?
      <>
        <h3 className="history-title">Turn History</h3>
        <div className="game-history">
          { historyEntries}
        </div>
      </>
       : ""
      }
      
    </aside>
  )
}