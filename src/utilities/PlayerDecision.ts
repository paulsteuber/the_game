import { Game, Player, PlayerCard, Possibility, Stack } from "../types";

export class PlayerDecision {
  player: Player;
  game: Game;
  bestPossibilities: Possibility[];
  constructor(player: Player, game: Game) {
    this.player = JSON.parse(JSON.stringify(player));
    this.game = JSON.parse(JSON.stringify(game));
    this.bestPossibilities = this.decisionMaker();
  }
  public getBestPossibility(minimumCardsToPlay: number): Possibility {
    //filter all poss with less than minimum cards length
    const possMinimum = this.bestPossibilities.filter(
      (pos: Possibility) => pos.way.length >= minimumCardsToPlay
    );
    const bestPossibility = possMinimum.reduce(function (prev, curr) {
      return prev.weight < curr.weight ? prev : curr;
    });
    console.log("POSS MIN", possMinimum);
    return bestPossibility;
  }
  private decisionMaker(): Possibility[] {
    function findWays(newhand: PlayerCard[], nstack: Stack[]) {
      const results: any = [];
      newhand.forEach((handNr) => {
        const lvl: any = [];
        nstack.forEach((stack, stackId) => {
          const lastStackNum = stack.cards[stack.cards.length - 1];
          const dist = stack.up
            ? handNr.value - lastStackNum
            : lastStackNum - handNr.value;
          /**console.log(
            `Stack ${stack.up ? "up" : "down"} | Hand ${
              handNr.value
            } - Stack Last ${lastStackNum} | DIST ${dist}`
          ); **/
          if (dist > 0 || dist === -10) {
            // play the card and refresh the value of the stack
            const nextHand = newhand.filter((h) => h !== handNr);
            const nextStacks: Stack[] = nstack.map((s, sid) => {
              if (sid === stackId) {
                console.log(stackId, " CARD BF ", s.cards[s.cards.length - 1]);
                s.cards.push(handNr.value);
                console.log(stackId, "CARD ", s.cards[s.cards.length - 1]);
              }

              return s;
            });
            // const nextStacks: Stack[] = JSON.parse(JSON.stringify(nstack));
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
      return results;
    }
    function findTheBestWay(waysArray: any) {
      const allPossibilites: any = [];

      function rec(wayArray: any, possBefore: any) {
        wayArray.forEach((way: any) => {
          //first push possibility without next
          const newPoss = {
            weight: way.distance,
            way: [
              { hand: way.hand, dist: way.distance, stack_id: way.stack_id },
            ],
          };
          if (possBefore) {
            newPoss.weight = newPoss.weight + possBefore.weight;
            newPoss.way = [...newPoss.way, ...possBefore.way];
          }
          allPossibilites.push(newPoss);
          if (way.next) {
            rec(way.next.flat(), newPoss);
          }
        });
      }
      waysArray.forEach((wayArr: any) => {
        rec(wayArr, null);
      });
      return allPossibilites;
    }
    return findTheBestWay(findWays(this.player.cards, this.game.stacks));
  }
}
