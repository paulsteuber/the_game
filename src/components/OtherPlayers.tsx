import { useContext } from "react";
import { GameContext } from "../GameContext";
import { Player } from "../types";
import { OtherPlayer } from "./OtherPlayer";

export function OtherPlayers(){
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const otherPlayers:Player[] = gameStore.players.filter((pl: Player, plID: number) => plID !== 0);
  return (<div className="container other-players d-flex justify-content-evenly p-4">{otherPlayers.map((player: Player, playerId: number) => <OtherPlayer key={playerId+1} {...player} />)}</div>);
}