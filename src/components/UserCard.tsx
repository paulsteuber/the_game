import { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { Stack } from "../types";

export function UserCard(cardNumber: { value: number }) {
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const [buttonStatus, setButtonStatus] = useState([
    { className: "btn-light" },
    { className: "btn-light" },
    { className: "btn-light" },
    { className: "btn-light" },
  ]);

  useEffect(() => {
    const newButtonStatus = { ...buttonStatus };
    gameStore.stacks.forEach((stack: Stack, index: number) => {
      const isAllowed = TheGame.isCardAllowed(cardNumber.value, stack);
      newButtonStatus[index].className = isAllowed ? "btn-light" : "btn-danger";
    });
    setButtonStatus(newButtonStatus);
  }, []);
  const addCardToStack = (stackId: number) => {
    const game = { ...gameStore };
    const selectedStack = game.stacks[stackId];
    /** check if user is allowed to add this number */
    const isAllowed = TheGame.isCardAllowed(cardNumber.value, selectedStack);
    if (isAllowed) {
      selectedStack.cards.push(cardNumber.value);
      //remove card from players hand
      console.log("Player Cards", game.players[0].cards, cardNumber.value);
      const newUserCards = game.players[0].cards.filter(
        (num: number) => num !== cardNumber.value
      );
      game.players[0].cards = newUserCards;
      console.log(game.players[0].cards);
      /** SET NEW GAME STORE */
      setGameStore(game);
    } else {
      let newBtnStatus = { ...buttonStatus };
      newBtnStatus[stackId].className = "btn-danger";
      setButtonStatus(newBtnStatus);
      setTimeout(() => {
        newBtnStatus = { ...buttonStatus };
        newBtnStatus[stackId].className = "btn-light";
        setButtonStatus(newBtnStatus);
      }, 1500);
    }
  };
  return (
    <div className="card-wrapper m-2 p-2 d-flex align-items-center flex-column">
      <div className="card-header shadow">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className={buttonStatus[0].className + " btn btn-sm"}
            onClick={() => {
              addCardToStack(0);
            }}
          >
            A
          </button>
          <button
            type="button"
            className={buttonStatus[1].className + " btn btn-sm"}
            onClick={() => {
              addCardToStack(1);
            }}
          >
            B
          </button>
          <button
            type="button"
            className={buttonStatus[2].className + " btn btn-sm"}
            onClick={() => {
              addCardToStack(2);
            }}
          >
            C
          </button>
          <button
            type="button"
            className={buttonStatus[3].className + " btn btn-sm"}
            onClick={() => {
              addCardToStack(3);
            }}
          >
            D
          </button>
        </div>
      </div>
      <div className="user-card rounded-2 shadow py-4 m-2 d-flex justify-content-center align-items-center">
        <span className="h1 fw-bolder m-0 p-4">{cardNumber.value}</span>
      </div>
    </div>
  );
}
