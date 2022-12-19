import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { HistoryEntry } from "../types";

export function GameHistory(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  
  const miniCard = (number: number)=>{
    return (<span className="mini-card">{number}</span>)
  }

  const historyEntries = gameStore.history.map((entry: HistoryEntry) => {
    const isTenBagger = TheGame.isCardTenBagger(entry.playedCard, entry.stack);
    const tenBaggerOutput = (entry.stack.up ? " decreased" : " increased")+" the stack by 10 points"
  return (
    <div className={(isTenBagger? "ten-bagger" :"")+" history-entry"}>
      <p>
        <span className="player-name">{entry.player === 0 ? "You": gameStore.players[entry.player].name}</span>
        {isTenBagger ? <span>{tenBaggerOutput} by playing card {miniCard(entry.playedCard)}</span>: ""}
        {!isTenBagger ? <span> played {miniCard(entry.playedCard)}</span>: ""}
      </p>
    </div>
  )});
  return(
    <aside className="game-history-wrapper">
      <div className="game-history">
        {historyEntries}
      </div>
    </aside>
  )
}