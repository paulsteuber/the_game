import { useContext } from "react";
import { GameContext } from "../GameContext";
import {UserCard} from "./UserCard";

export function User(){
  const { gameStore, setGameStore  } = useContext<any>(GameContext);
  const userCards = gameStore.players[0].cards;
  const userCardsComponents = userCards.map((card: number) => {
    const number = {
      value: card
    }
    return (<UserCard key={number.value} {...number}/>)})
  return (
    <div className="d-flex justify-content-center align-items-center flex-column user">
      User Cards
      <div className="d-flex justify-content-center">
        {userCardsComponents}
      </div>
      
    </div>
  )
}