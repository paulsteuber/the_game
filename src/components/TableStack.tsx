import { useContext } from "react";
import { GameContext } from "../GameContext";
import { Stack } from "../types";

export function TableStack(stack: Stack){
  const { gameStore, setGameStore  } = useContext<any>(GameContext);
  const abcd = "ABCD";
  return (
    <div className="stack rounded-1 shadow m-3 p-2">
      <div className="stack-header d-flex">
        <h3 className="title">{abcd[stack.id]}</h3>
        <div className="type">
          {stack.up && <i className="bi bi-arrow-up"></i>}
          {!stack.up && <i className="bi bi-arrow-down"></i>}
        </div>
      </div>
      <div className="top-card rounded-2 my-2 p-2 d-flex justify-content-center align-items-center">
      { !stack.cards.length? 
          stack.up? <div className="h3 fw-bolder">1</div>:<div className="h3 fw-bolder">100</div>      
        : <div className="h3 fw-bolder">{stack.cards[stack.cards.length - 1]}</div>
      }
      </div>
    </div>
  )
}