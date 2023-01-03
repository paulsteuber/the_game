import { Game, Player, Possibility, Stack } from "../types";

export class PossibilityCalculation {
  player: Player;
  game: Game;
  possibilities: Possibility[];
  endResult: Possibility;
  gameProgress: number;
  constructor(player: Player, game: Game, possibilities: Possibility[]) {
    this.player = player;
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
    const algoWeight = filtered20.map((pos) => this.calculateGameWeight(pos, this.getOthersTenBagger()));
    const result = algoWeight.reduce(function (prev, curr) {
      return prev.stackWeight < curr.stackWeight ? prev : curr;
    });
    return result;
  }
  private getOthersTenBagger(){
    /** other players ten bagger penalty */
    const othersTenBagger: {playerDistance: number, stackId: number }[] = [];
    this.game.players.forEach((pl, plID) =>{
      //ignore own ten baggers
      if(pl.name === this.player.name) return;
      if(othersTenBagger.length === 4) return;

      pl.cards.forEach(c => {
        for (const [key, value] of Object.entries(c.stackStatus)) {
          const stackId = this.letterToNumber(key);
          if(value === 10) {
            othersTenBagger.push({playerDistance: this.playerPlayerDistance(pl), stackId: stackId})
          }
        }
      })
    });
    return othersTenBagger;
  }
  private playerPlayerDistance(otherPlayer: Player){
    const ownIndex = this.game.players.indexOf(this.player);
    const otherIndex = this.game.players.indexOf(otherPlayer);
    const playerLength = this.game.players.length;
    const dist = otherIndex < ownIndex ? playerLength - ownIndex + otherIndex : otherIndex - ownIndex;
    return dist;
  }

  private calculateGameWeight(pos: Possibility, otherTenBaggers: {playerDistance: number, stackId: number }[]): Possibility {
    const newPos = { ...pos };
    const copyStacks = [...this.game.stacks];

    let newCalculatedWeight = 0; //first take the orginial weight

    let impactedTenBaggers: {playerDistance: number, stackId: number }[] = [];
    pos.way.forEach((w) => {
      /** TEN BAGGER CHECK */
      const impactedTenBagger = otherTenBaggers.find(tenBagger => w.stack_id === tenBagger.stackId);
      if(impactedTenBagger) impactedTenBaggers.push(impactedTenBagger);

      
      const stack = copyStacks[w.stack_id];
      const stackLastCard = stack.cards[stack.cards.length - 1];

      const stackProgress = stack.up
        ? (stackLastCard+1) / 99
        : (99 - stackLastCard + 1) / 99;
      // CALCULATE WEIGHT
      newCalculatedWeight =
        newCalculatedWeight + (w.dist * Math.pow(1+stackProgress, 2));
      stack.cards.push(w.hand);
      //REDUCE WEIGHT IF DIST JUST 1
      newCalculatedWeight = w.dist === 1 ? newCalculatedWeight -1 : newCalculatedWeight;
    });
    impactedTenBaggers = [...new Set(impactedTenBaggers)]; // remove duplicates
    let tenBaggerPenalty = 0;
    impactedTenBaggers.forEach(tb => {
      let penalty = 10 - Math.pow(tb.playerDistance, 2);
      penalty = penalty < 1 ? 1: penalty;
      tenBaggerPenalty+= penalty;
    })
    console.log("PENALTY",tenBaggerPenalty, pos, this.player)
    console.log("newCalculatedWeight", newCalculatedWeight, "OLD", newPos)
    newPos.stackWeight = newCalculatedWeight + tenBaggerPenalty;
    return newPos;
  }
  private letterToNumber(letter:string):number {

    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  }
  private calculateGameProgress() {
    return (
      (this.game.refillStack.length +
        this.game.players.reduce((prevSum, a) => prevSum + a.cards.length, 0)) /
      98
    );
  }
}
