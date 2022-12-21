import { Game, Possibility } from "../types";

export class PossibilityCalculation {
  game: Game;
  possibilities: Possibility[];
  endResult: Possibility;
  gameProgress: number;
  constructor(game: Game, possibilities: Possibility[]) {
    this.game = game;
    this.possibilities = possibilities;
    this.gameProgress = this.calculateGameProgress();
    console.log(this.gameProgress);
    this.endResult = this.findEndResult();
  }
  public getBestResult = () => this.endResult;

  private findEndResult(): Possibility {
    const sorted = this.possibilities.sort((a, b) => a.weight - b.weight);

    //filter all posses with max weight diff of 15 to the minimum poss
    const minimumWeight = sorted[0].weight;
    const filtered20 = sorted.filter((pos) => pos.weight <= minimumWeight + 20);
    //console.log("FILTERED", filtered20);
    const algoWeight = filtered20.map((pos) => this.calculateGameWeight(pos));
    const result = algoWeight.reduce(function (prev, curr) {
      return prev.stackWeight < curr.stackWeight ? prev : curr;
    });
    return result;
  }
  private calculateGameWeight(pos: Possibility): Possibility {
    const newPos = { ...pos };
    let newCalculatedWeight = 0; //first take the orginial weight
    const copyStacks = [...this.game.stacks];

    pos.way.forEach((w) => {
      const stack = copyStacks[w.stack_id];
      const stackLastCard = stack.cards[stack.cards.length - 1];

      const stackProgress = stack.up
        ? stackLastCard / 98
        : (98 - stackLastCard) / 98;

      newCalculatedWeight =
        newCalculatedWeight + (w.dist * Math.pow(1+stackProgress, 2));
      stack.cards.push(w.hand);
    });
    newPos.stackWeight = newCalculatedWeight;
    return newPos;
  }

  private calculateGameProgress() {
    return (
      (this.game.refillStack.length +
        this.game.players.reduce((prevSum, a) => prevSum + a.cards.length, 0)) /
      98
    );
  }
}
