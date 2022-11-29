import CardHelper from "./utilities/CardHelper";
export type PlayerCard = {
  value: number;
  stackStatus: { a: boolean; b: boolean; c: boolean; d: boolean };
};
export type WannaPlay = {
  card: number;
  targetStackId: number;
};
export type TenBagger = {
  hand: [{ cards: number[] }];
  stack: [{ stackCard: number; handCard: number; stackId: number }];
};
export type Player = {
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
  way: [{ hand: PlayerCard; dist: number; stack_id: number }];
};
