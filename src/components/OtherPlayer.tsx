import { animated,  useTransition } from "react-spring";
import { Player } from "../types";

export function OtherPlayer(player: Player) {

  const transition = useTransition(player.cards, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: {opacity: 0, y: 10 },
  });
  return (
  <div className="player">
    <div className="player-head d-flex flex-column align-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-person-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
      <p className="h5 fw-bolder">{player.name}</p>
      <span>{player.lastMoveCardsCount}</span>
    </div>
      <div className="other-player-cards d-flex">{
      transition((style, card) => {
          const statusClass = Object.values(card.stackStatus).filter(
            (status) => status === 10
          ).length
            ? "ten-bagger"
            : "";
          const tenBaggerStack = Object.entries(card.stackStatus).filter(
            (status) => status[1] === 10
          );
          const tenBaggerStackOutput = tenBaggerStack.length
            ? tenBaggerStack[0][0]
            : card.value;

          return(
          <animated.div style={style} className={
            statusClass +
            " other-player-card p-2 d-flex align-items-center justify-content-center fw-bolder shadow"
          }>
          {tenBaggerStackOutput}
          </animated.div>)
          }
          )
        }
      </div>
    </div>
  );
}