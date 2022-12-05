import { Game, Player, PlayerCard, Possibility, Stack } from "../types";

export class PlayerDecision {
  player: Player;
  game: Game;
  allPossibilities: Possibility[];
  constructor(player: Player, game: Game) {
    this.player = JSON.parse(JSON.stringify(player));
    this.game = JSON.parse(JSON.stringify(game)); 
    this.allPossibilities = this.decisionMaker();
  }
  private decisionMaker(): Possibility[] {

    const allWays = this.findAllWays();
    const flattenAllWays = this.flattenAllWays(allWays);
    return flattenAllWays;
  }

  public getBestPossibility(minimumCardsToPlay: number): Possibility | false {
    //filter all poss with less than minimum cards length
    const possMinimum = this.allPossibilities.filter(
      (pos: Possibility) => pos.way.length >= minimumCardsToPlay
    );
    if(!possMinimum.length) false;
    console.log("POSS MINIMUM",possMinimum)
    const bestPossibility = possMinimum.reduce(function (prev, curr) {
      return prev.weight < curr.weight ? prev : curr;
    });
    return bestPossibility;
  }


  private flattenAllWays(waysArray: any) {
    const allPossibilites: any = [];

    function flattenWay(wayArray: any, possBefore: any) {
      wayArray.forEach((way: any) => {
        //first push possibility without next
        const newPoss = {
          weight: way.dist,
          way: [
            { hand: way.hand, dist: way.dist, stack_id: way.stack},
          ],
        };
        if (possBefore) {
          newPoss.weight = newPoss.weight + possBefore.weight;
          newPoss.way = [...possBefore.way, ...newPoss.way];
        }
        allPossibilites.push(newPoss);
        if (way.next) {
          flattenWay(way.next.flat(), newPoss);
        }
      });
    }
    waysArray.forEach((wayArr: any) => {
      flattenWay(wayArr, null);
    });
    console.log(allPossibilites);
    return allPossibilites;
  }


  private getDistance(handCard: number, stack: Stack){
    const lastStackNumber = stack.cards[stack.cards.length - 1 ];
    return stack.up ? handCard - lastStackNumber : lastStackNumber - handCard;
  }

  private findNextWay(handAsNumbers: number[], initialStack: {
    up: boolean,
    id: number,
    lastCard: number
  }[]):any[]{
    const results:any[] = [];
    handAsNumbers.forEach((handCard) => {
      const waysPerNumber:any[] = [];
      initialStack.forEach((stack, stackID) => {
        const dist = stack.up ? handCard - stack.lastCard : stack.lastCard - handCard;

        if(dist === -10 || dist > 0){
          const nextHand = handAsNumbers.filter((h) => h !== handCard);
          let nextStacks = initialStack.map(s => {
            const lastCard = s.id === stackID ? handCard: s.lastCard;
            return ({
              up: s.up,
              id: s.id,
              lastCard: lastCard
            })
          });
          const way = {
            hand: handCard,
            dist: dist,
            stack: stack.id,
            next: this.findNextWay(nextHand, nextStacks)
          }
          waysPerNumber.push(way);
        }
        
      });
      if(waysPerNumber.length){
        results.push(waysPerNumber);
      }
    });
    return results;
  }

  private findAllWays():any[]{
    
    const handAsNumbers: number[] = this.player.cards.map(c => c.value);
    const initialGameStacks: Stack[] = JSON.parse(JSON.stringify(this.game.stacks));

    const results:any[] = [];
    handAsNumbers.forEach((handCard) => {
      const waysPerNumber:any[] = [];
      initialGameStacks.forEach((stack, stackID) => {
        const dist = this.getDistance(handCard, stack);

        if(dist === -10 || dist > 0 && dist){
          const nextHand = handAsNumbers.filter((h) => h !== handCard);
          let nextStacks = initialGameStacks.map((s => {
            const lastCard = s.id === stackID ? handCard: s.cards[s.cards.length - 1];
            return ({
              up: s.up,
              id: s.id,
              lastCard: lastCard
            })
          }));
          const way = {
            hand: handCard,
            dist: dist,
            stack: stack.id,
            next: this.findNextWay(nextHand, nextStacks)
          }
          waysPerNumber.push(way);
        }
        
      });
      if(waysPerNumber.length){
        results.push(waysPerNumber);
      }
    });
    return results;
  }


  
}
