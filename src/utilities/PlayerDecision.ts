import { Game, Player, PlayerCard, Stack, TenBagger } from "../types";

export class PlayerDecision {
  player: Player;
  game: Game;
  constructor(player: Player, game: Game) {
    this.player = player;
    this.game = game;
    this.decisionMaker();
  }
  private decisionMaker() {
    function findWays(newhand: PlayerCard[], nstack: Stack[]) {
      const results: any = [];
      newhand.forEach((handNr) => {
        const lvl: any = [];
        nstack.forEach((stack, stackId) => {
          const lastStackNum = stack.cards[stack.cards.length - 1];
          const dist = stack.up
            ? handNr.value - lastStackNum
            : lastStackNum - handNr.value;
          console.log("DIST", lastStackNum, handNr.value);
          if (dist > 0 || dist === -10) {
            const nextHand = newhand.filter((h) => h !== handNr);
            console.log("Next Hand", nextHand);
            // play the card and refresh the value of the stack
            const nextStacks: Stack[] = [...nstack];
            nextStacks[stackId].cards.push(handNr.value);
            lvl.push({
              hand: handNr,
              stack_id: stackId,
              distance: dist,
              next: findWays(nextHand, nextStacks),
            });
          }
        });
        if (lvl.length) {
          results.push(lvl);
        }
      });
      console.log("RES", results);
      return results;
    }

    function findTheBestWay(waysArray: any, minimumCards: any) {
      const allWays: any = [];

      function rec(wayArray: any, possBefore: any) {
        wayArray.forEach((way: any) => {
          //first push possibility without next
          const newPoss = {
            weight: way.distance,
            cards: [
              { hand: way.hand, dist: way.distance, stack_id: way.stack_id },
            ],
          };
          if (possBefore) {
            newPoss.weight = newPoss.weight + possBefore.weight;
            newPoss.cards = [...newPoss.cards, ...possBefore.cards];
          }
          allWays.push(newPoss);
          if (way.next) {
            rec(way.next.flat(), newPoss);
          }
        });
      }
      waysArray.forEach((wayArr: any) => {
        rec(wayArr, null);
      });
      console.log(allWays);
    }
    findTheBestWay(findWays(this.player.cards, this.game.stacks), 2);
  }
}
