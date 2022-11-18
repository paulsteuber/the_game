import { Stack } from "../types";

export default class PlayHelper{
  playerCards: number[];
  stacks: Stack[];
  

  constructor(playerCards: number[], stacks: Stack[]){
    this.playerCards = playerCards;
    this.stacks = stacks;
    this.findTenBagger();
  }

  private findTenBagger(){
    // h2h - Hand to Hand Tenbagger
    const tenBagger:{h2h: [{start: number, end: number}], stack: {hand: number, stacknumber: number, stackindex: number}} = {
      h2h: this.findHandToHandTenBagger(),
      stack: this.findStackTenBagger()
    }
    console.log(tenBagger);


  }
  private findStackTenBagger():{hand: number, stacknumber: number, stackindex: number}{
    const numbers = this.playerCards;
    const resultArr: any = [];
    this.stacks.forEach((stack, stackIndex) => {
      const topCard = stack.cards[stack.cards.length - 1];
      const up = stack.up;
      let match = [];
      if(up){
        match = numbers.filter((n) => n === topCard - 10);
      } else {
        match = numbers.filter((n) => n === topCard + 10);
      }

      if(match.length){
        resultArr.push({
          hand: match[0],
          stacknumber: topCard,
          stackindex: stackIndex
        });
      }
    })
    return resultArr;
  }
  private findHandToHandTenBagger():[{start: number, end: number}]{
    const numbers = this.playerCards;
    const h2hArray: any = [];
    numbers.forEach((num, i) => {
      numbers.forEach((testNum) => {
        if (num + 10 === testNum) {
          h2hArray.push({
            start: num,
            end: testNum
          });
        }
        if (num - 10 === testNum) {
          h2hArray.push({
            start: testNum,
            end: num
          });
        }
      });
    });
    return h2hArray.filter((obj:number, ind:number) => ind%2);
  }
}