import CardHelper from "./utilities/CardHelper";
export type PlayerCard = {
  value: number;
  stackStatus: { a: boolean| 10; b: boolean | 10; c: boolean | 10; d: boolean| 10 };
};
export type WannaPlay = {
  card: number;
  targetStackId: number;
};
export type Player = {
  name: string,
  cards: PlayerCard[];
};
export type Stack = {
  id: number;
  up: boolean;
  cards: number[];
};
export type Status = {
  allowUserToPlay: boolean;
};
export type Game = {
  status: Status;
  initialized: boolean;
  players: Player[];
  stacks: [Stack, Stack, Stack, Stack];
  refillStack: number[];
};
export type Possibility = {
  weight: number;
  way: [{ hand: number; dist: number; stack_id: number }];
};
