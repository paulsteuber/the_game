import { Game, Player, TenBagger } from "../types";

export class PlayerDecision {
  player: Player;
  game: Game;
  constructor(player: Player, game: Game) {
    this.player = player;
    this.game = game;
    this.decisionMaker();
  }
  private decisionMaker() {
    const hand = [43, 13, 23]; /// 13, 23

    const stacks = [33, 30]; //up ///43, 30

    console.log("HAND", hand);

    console.log("STACKS", stacks);

    const recommendations = [];

    const objectDepth = (o: Object): number =>
      Object(o) === o
        ? 1 + Math.max(-1, ...Object.values(o).map(objectDepth))
        : 0;

    function findNext(newhand: number[], nstack: number[]) {
      const results: any = [];
      newhand.forEach((handNr, handIndex) => {
        const lvl: any = [];
        nstack.forEach((stack, stackId) => {
          const dist = handNr - stack;

          if (dist > 0 || dist === -10) {
            const nextHand = newhand.filter((h) => h !== handNr);
            console.log("Next Hand", nextHand);
            const nextStacks: number[] = [...nstack];
            nextStacks[stackId] = handNr;
            lvl.push({
              hand: handNr,
              stack_id: stackId,
              distance: handNr - stack,
              next: findNext(nextHand, nextStacks),
            });
          }
        });
        if (lvl.length) {
          results.push(lvl);
        }
      });
      return results;
    }

    function findTheBestWay(waysArray: any, minimumCards: any) {
      waysArray.forEach((wayArray: any) => {
        wayArray.forEach((way: any) => {
          console.log("WAY DEPTH", objectDepth(way), way);
        });
      });
    }
    findTheBestWay(findNext(hand, stacks), 2);
  }
}
