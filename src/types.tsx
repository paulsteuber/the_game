import CardHelper from "./utilities/CardHelper"

export type Player = {
  cards: number[],
}
export type Stack = {
  id: number
  up: boolean
  cards: number[]
}
export type Game = {
  initialized: boolean;
  players: Player[];
  stacks: [Stack, Stack, Stack, Stack];
  refillStack: number[];  
}
