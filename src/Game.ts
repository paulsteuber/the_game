import { Player, Stack } from "./types";
import CardHelper from "./utilities/CardHelper"

export class Game{
    initialized: boolean = false;
    players: Player[] = [];
    stacks: [Stack, Stack, Stack, Stack] = [
      {up: true, cards:[]},
      {up: true, cards:[]},
      {up: false, cards:[]},
      {up: false, cards:[]},
    ];
    refillStack: number[];


    constructor(){
      //mix all cards
      this.refillStack = CardHelper.mix([ ...Array(98).keys() ].map( i => i+2));
    }
    init(playerCount: number){
      //create all players
      for(let i = 0; i <= playerCount; i++){
        let newPlayer = {
          cards:[]
        }
        this.players.push(newPlayer);
      }
      //
      //give all players their frist cards
      const countCards: number = CardHelper.cardsPerPlayer(this.players.length);
      const newPlayers = this.players.map((player: Player) => {
        let cards: number[] = [];
        for(let i = 0; i <= countCards; i++){
          const card: number | undefined = this.refillStack.length ? this.refillStack.shift() : undefined;
          if(card){
            cards.push(card);
          }
        }
        return {cards: cards};
      });
      console.log(newPlayers);
      this.players = newPlayers;



      this.initialized = true;
    }
    toObject():Object{
      return ({
        initialized: this.initialized,
        players: this.players,
        stacks: this.stacks,
        refillStack: this.refillStack
      });
    }
}

