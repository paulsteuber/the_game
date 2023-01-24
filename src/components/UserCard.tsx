import { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import TheGame from "../TheGame";
import { PlayerCard, Stack } from "../types";
import { useTransition, animated } from "react-spring";
import { Card } from "./Card";

export function UserCard(props:{card:PlayerCard, cardIndex: number}) {
  const card = props.card;
  const cardIndex = props.cardIndex;
  const { gameStore, setGameStore } = useContext<any>(GameContext);
  const btnStatus = ["btn-light","btn-primary", "btn-danger"];

  useEffect(() => {}, []);
  const addCardToStack = (stackId: number) => {
    let game = { ...gameStore };
    const selectedStack = game.stacks[stackId];
    /** check if user is allowed to add this number */
    const isAllowed = TheGame.isCardAllowed(card.value, selectedStack);
    if (isAllowed) {
      setGameStore(TheGame.addHistoryEntry(game, 0, card.value, game.stacks[stackId]))
      setGameStore(TheGame.removeHistoryEntries(game))
      game = {...gameStore};
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
  const dragStarted = (e:any, card: PlayerCard) => {
    e.dataTransfer.setData("card", card.value);
  };
  const transition = useTransition(true, {
    from: { opacity: 0, scale: 1.1, y: 100 },
    enter: { opacity: 1, scale: 1, y: 0 },
    leave: { opacity: 0, scale: 0, y: 100 },
    delay: 500 + (cardIndex*100),
  });

  const cardStatusBtn = (stackStatus: boolean | 10) => {
    if(stackStatus == true) return btnStatus[0];
    if(stackStatus == 10) return btnStatus[1]
    return btnStatus[2]

  };
  return (transition((style) => (
    <animated.div key={card.value} style={style}>
<div
      draggable
      onDragStart={(e) => dragStarted(e, card)}
      className="card-wrapper m-2 p-2 d-flex align-items-center flex-column"
    >
      <div className="card-header shadow my-3">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className={cardStatusBtn(card.stackStatus.a) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(0);
            }}
          >
            A
          </button>
          <button
            type="button"
            className={cardStatusBtn(card.stackStatus.b) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(1);
            }}
          >
            B
          </button>
          <button
            type="button"
            className={cardStatusBtn(card.stackStatus.c) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(2);
            }}
          >
            C
          </button>
          <button
            type="button"
            className={cardStatusBtn(card.stackStatus.d) + " btn btn-sm"
            }
            onClick={() => {
              addCardToStack(3);
            }}
          >
            D
          </button>
        </div>
      </div>
      <Card {...{cardValue:card.value, type: "normal" }}/>
    </div>
    </animated.div>
    
  )));
}
