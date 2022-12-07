import { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { PlayerCard, Stack } from "../types";
import { useTransition, animated } from "react-spring";

export function UserCard(props:{card:PlayerCard, cardIndex: number}) {
  const card = props.card;
  const cardIndex = props.cardIndex;
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const btnStatus = ["btn-light", "btn-danger"];

  useEffect(() => {}, []);
  const addCardToStack = (stackId: number) => {
    const game = { ...gameStore };
    const selectedStack = game.stacks[stackId];
    /** check if user is allowed to add this number */
    const isAllowed = TheGame.isCardAllowed(card.value, selectedStack);
    if (isAllowed) {
      selectedStack.cards.push(card.value);
      //remove card from players hand
      const newUserCards = game.players[0].cards.filter(
        (c: PlayerCard) => c.value !== card.value
      );
      game.players[0].cards = newUserCards;
      /** REFRESH ALL PLAYERCARD STATUS */
      game.players = TheGame.refreshPlayerCardsStatus(
        game.players,
        game.stacks
      );
      /** SET NEW GAME STORE */
      setGameStore(game);
    }
  };
  const dragStarted = (e, card: PlayerCard) => {
    console.log("DRAG STARTED", card.value);
    e.dataTransfer.setData("card", card.value);
  };
  const transition = useTransition(true, {
    from: { opacity: 0, scale: 1.1, y: 100 },
    enter: { opacity: 1, scale: 1, y: 0 },
    leave: { opacity: 0, scale: 0, y: 100 },
    delay: cardIndex*100,
  });
  return (transition((style) => (
    <animated.div key={card.value} style={style}>
<div
      draggable
      onDragStart={(e) => dragStarted(e, card)}
      className="card-wrapper m-2 p-2 d-flex align-items-center flex-column"
    >
      <div className="card-header shadow">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className={
              (card.stackStatus.a ? btnStatus[0] : btnStatus[1]) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(0);
            }}
          >
            A
          </button>
          <button
            type="button"
            className={
              (card.stackStatus.b ? btnStatus[0] : btnStatus[1]) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(1);
            }}
          >
            B
          </button>
          <button
            type="button"
            className={
              (card.stackStatus.c ? btnStatus[0] : btnStatus[1]) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(2);
            }}
          >
            C
          </button>
          <button
            type="button"
            className={
              (card.stackStatus.d ? btnStatus[0] : btnStatus[1]) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(3);
            }}
          >
            D
          </button>
        </div>
      </div>
      <div className="user-card rounded-2 shadow py-4 m-2 d-flex justify-content-center align-items-center">
        <span className="h1 fw-bolder m-0 p-4">{card.value}</span>
      </div>
    </div>
    </animated.div>
    
  )));
}
