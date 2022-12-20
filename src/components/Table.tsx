import { useContext } from "react";
import { GameContext } from "../GameContext";
import { Stack } from "../types";
import { RefillStack } from "./RefillStack";
import { TableStack } from "./TableStack";

export function Table(){
  const { gameStore, setGameStore  } = useContext<any>(GameContext);
  const stacks = gameStore.stacks;
  return (
    <div className="d-flex justify-content-center align-items-center">
          {stacks? stacks.map((stack: Stack) => {
            return <TableStack  key={stack.id} {...stack} />
          }):""}  

          <RefillStack />
    </div>
  )
}