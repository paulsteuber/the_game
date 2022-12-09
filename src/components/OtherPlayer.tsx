import { Player } from "../types";

export function OtherPlayer(player: Player){

  return (
  <div className="player">
    <div className="player-head d-flex flex-column align-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
      </svg>
      <p className="h5 fw-bolder">{player.name}</p>
    </div>
    
    
    {player.cards.map((card => <div className="other-player-card">{card.value}</div>))}</div>)

}