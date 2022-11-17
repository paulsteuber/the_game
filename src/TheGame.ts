import { Game, Player, Stack } from "./types";
import CardHelper from "./utilities/CardHelper"

export default class TheGame{
  constructor(){}

  static getNewGame(): Game{
    return {
      initialized: false,
      players: [],
      stacks: [
        {id: 0, up: true, cards:[]},
        {id: 1, up: true, cards:[]},
        {id: 2, up: false, cards:[]},
        {id: 3, up: false, cards:[]},
      ],
      refillStack: CardHelper.mix([ ...Array(98).keys() ].map( i => i+2))  
    }
  }
  static initPlayers(playerCount: number): Player[]{
    let players: Player [] = [];
    for(let i = 0; i < playerCount; i++){
      let newPlayer = {
        cards:[]
      }
      players.push(newPlayer);
    }
    return players;
  }
  static givePlayersCards(game: Game): Game{
     const countCards: number = CardHelper.cardsPerPlayer(game.players.length);
     console.log("Playyyyyaas", game.players)
     //give all players their first cards
     for(let p = 0; p < game.players.length; p++){
       console.log("Player ",p);
       let cards: number [] = [];
       for (let c = 0; c < countCards; c++){
         const shiftedNum: number | undefined = game.refillStack.shift();
         if (!shiftedNum) break;
         game.players[p].cards.push(shiftedNum);
       }
       game.players[p].cards = CardHelper.sortCards(game.players[p].cards);
     }
     console.log("GAME", game)
     return game;
  }

  static isCardAllowed(cardValue: number, stack: Stack):boolean{
    if(!stack.cards.length) return true;
    const lastStackNumber:number = stack.cards[stack.cards.length -1];
    console.log(lastStackNumber);
    if(stack.up){
      return lastStackNumber < cardValue  || lastStackNumber -10 === cardValue
    }
    return lastStackNumber > cardValue || lastStackNumber +10 === cardValue
  }

  static isAllowedFinishMove(game: Game): boolean {
    //if refillstack is not empty player must play minimum 2 cards
    const minimumPlayedCards: number  = game.refillStack.length ? 2: 1;
    const cardsPerPlayer: number = CardHelper.cardsPerPlayer(game.players.length);
    if(game.players[0].cards.length <= cardsPerPlayer - minimumPlayedCards){
      return true;
    }
    return false;
    
  }

  static otherPlayerPlay(game: Game):Game{
    return game;
  }
}

