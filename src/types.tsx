import CardHelper from "./utilities/CardHelper"

export type Player = {
  cards: number[],
}
export type Stack = {
  id: number
  up: boolean
  cards: number[]
}
export type Status= {
  allowUserToPlay: boolean
}
export type Game = {
  status: Status,
  initialized: boolean;
  players: Player[];
  stacks: [Stack, Stack, Stack, Stack];
  refillStack: number[];  
}
