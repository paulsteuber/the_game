import { useContext, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { PlayerCard, Stack } from "../types";

export function TableStack(stack: Stack) {
  const componentClasses ="stack rounded-1 shadow m-3 p-2";
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const [onDragOverStatus, setOnDragOverStatus] = useState(componentClasses);
  const abcd = "ABCD";
  

  const onDragOver = (e: any) => {
    let card:number = parseInt(e.dataTransfer.getData("card"));
    let ondragoverclassname = " ondrag-card-allowed";
    if(!TheGame.isCardAllowed(card, stack)){
      ondragoverclassname = " ondrag-card-reject";
    }
    setOnDragOverStatus(componentClasses+ondragoverclassname)
    e.stopPropagation();
    e.preventDefault();
  };
  const onDragLeave = (e: any) => {
    e.preventDefaulft;
    setOnDragOverStatus(componentClasses)
    console.log("onDragLeave");
  };
  const onDropped = (e: any) => {
    e.preventDefaulft;
    let card:number = parseInt(e.dataTransfer.getData("card"));
    setOnDragOverStatus(componentClasses)
    const cardIsAllowed = TheGame.isCardAllowed(card, stack)
    console.log("KARTE ", card, "IST ERLAUBT", stack.id);
    if(cardIsAllowed){
      // add card to stack
      const game = { ...gameStore };
      game.stacks[stack.id].cards.push(card);
      // and remove card from user
      game.players[0].cards = game.players[0].cards.filter((c:PlayerCard) => c.value !== card);
      console.log(game);
      setGameStore(game);
    } else {
      console.log("Karte ist nicht erlaubt")
    }
    //let card = e.dataTransfer.getData("card")
    //console.log(card);
  };
  

  return (
    <div onDragOver={(e) => onDragOver(e)} onDragLeave={(e)=> onDragLeave(e)} onDrop={(e)=>onDropped(e)} className={onDragOverStatus}>
      <div className="stack-header d-flex">
        <h3 className="title">{abcd[stack.id]}</h3>
        <div className="type">
          {stack.up && <i className="bi bi-arrow-up"></i>}
          {!stack.up && <i className="bi bi-arrow-down"></i>}
        </div>
      </div>
      <div className="top-card rounded-2 my-2 p-2 d-flex justify-content-center align-items-center">
        {!stack.cards.length ? (
          stack.up ? (
            <div className="h3 p-4 m-0 fw-bolder">1</div>
          ) : (
            <div className="h3 p-4 m-0 fw-bolder">100</div>
          )
        ) : (
          <div className="h3 p-4 m-0 fw-bolder">
            {stack.cards[stack.cards.length - 1]}
          </div>
        )}
      </div>
    </div>
  );
}
