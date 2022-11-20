import { Game, Player, Stack } from "./types";
import CardHelper from "./utilities/CardHelper";
import PlayHelper from "./utilities/PlayHelper";

export default class TheGame {
  constructor() {}

  static getNewGame(): Game {
    return {
      status: {
        allowUserToPlay: true,
      },
      initialized: false,
      players: [],
      stacks: [
        { id: 0, up: true, cards: [] },
        { id: 1, up: true, cards: [] },
        { id: 2, up: false, cards: [] },
        { id: 3, up: false, cards: [] },
      ],
      refillStack: CardHelper.mix([...Array(98).keys()].map((i) => i + 2)),
    };
  }
  static initPlayers(playerCount: number): Player[] {
    let players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      let newPlayer = {
        cards: [],
      };
      players.push(newPlayer);
    }
    return players;
  }
  static givePlayersCards(game: Game): Game {
    const countCards: number = CardHelper.cardsPerPlayer(game.players.length);
    console.log("Playyyyyaas", game.players);
    //give all players their first cards
    for (let p = 0; p < game.players.length; p++) {
      console.log("Player ", p);
      let cards: number[] = [];
      for (let c = 0; c < countCards; c++) {
        const shiftedNum: number | undefined = game.refillStack.shift();
        if (!shiftedNum) break;
        game.players[p].cards.push(shiftedNum);
      }
      game.players[p].cards = CardHelper.sortCards(game.players[p].cards);
    }
    return game;
  }

  static isCardAllowed(cardValue: number, stack: Stack): boolean {
    if (!stack.cards.length) return true;
    const lastStackNumber: number = stack.cards[stack.cards.length - 1];
    if (stack.up) {
      return lastStackNumber < cardValue || lastStackNumber - 10 === cardValue;
    }
    return lastStackNumber > cardValue || lastStackNumber + 10 === cardValue;
  }
  static isCardTenBagger(cardValue: number, stack: Stack): boolean {
    const lastStackNumber: number = stack.cards[stack.cards.length - 1];
    if (!stack.cards.length) return false;
    if (stack.up) {
      return lastStackNumber - 10 === cardValue;
    } else {
      return lastStackNumber + 10 === cardValue;
    }
  }

  static isAllowedFinishMove(game: Game): boolean {
    //if refillstack is not empty player must play minimum 2 cards
    const minimumPlayedCards: number = game.refillStack.length ? 2 : 1;
    const cardsPerPlayer: number = CardHelper.cardsPerPlayer(
      game.players.length
    );
    if (game.players[0].cards.length <= cardsPerPlayer - minimumPlayedCards) {
      return true;
    }
    return false;
  }
  static cardsPlayerWannaPlay(player: Player, game: Game):[{card: number, stackID: number}]{
    const minimumCardsToPlay = game.refillStack.length > 0 ? 2 : 1;


    return [{card: 1, stackID: 2}];
  }
  static otherPlayersPlay(game: Game):Game{
    let otherPlayers = game.players.filter((player, index ) => index != 0);

    otherPlayers.forEach((player, index) => {
      let wannaPlay: [{ card: number; toStackId: number }] | [];
      const playHelper = new PlayHelper(player.cards, game.stacks);

      wannaPlay = playHelper.getCardsToPlay();
      if (wannaPlay.length) {
        wannaPlay.forEach((wp) => {
          console.log("WP", wp);
          setTimeout(() => {
            //remove card from player cards array
            game.players[index + 1].cards = player.cards.filter(
              (card) => card !== wp.card
            );
            //add card to stack
            console.log("XXX", game.stacks);
            game.stacks[wp.toStackId].cards.push(wp.card);
            console.log(
              `Player ${index + 1} played Card ${wp.card} to Stack ${
                wp.toStackId
              }`
            );
          }, 1000);
        });
      }
    });
    return game;
  }
}
