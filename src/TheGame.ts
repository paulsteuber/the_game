import { Game, Player, PlayerCard, Stack } from "./types";
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
    //give all players their first cards
    for (let p = 0; p < game.players.length; p++) {
      for (let c = 0; c < countCards; c++) {
        const shiftedNum: number | undefined = game.refillStack.shift();
        if (!shiftedNum) break;
        game.players[p].cards.push({
          value: shiftedNum,
          stackStatus: { a: true, b: true, c: true, d: true },
        });
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
  static refreshPlayerCardsStatus(
    players: Player[],
    stacks: Stack[]
  ): Player[] {
    const refreshedPlayerCards = players.map((player) => {
      const refreshedCards = player.cards.map((card) => {
        card.stackStatus = {
          a: this.isCardAllowed(card.value, stacks[0]),
          b: this.isCardAllowed(card.value, stacks[1]),
          c: this.isCardAllowed(card.value, stacks[2]),
          d: this.isCardAllowed(card.value, stacks[3]),
        };
        return card;
      });
      player.cards = refreshedCards;
      return player;
    });
    players = refreshedPlayerCards;
    return players;
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
  static cardsPlayerWannaPlay(
    player: Player,
    game: Game,
    minimum: number
  ): [{ card: PlayerCard; stackID: number }] | any {
    const wannaPlay: [{ card: PlayerCard; stackID: number }] | [] = [];

    return wannaPlay;
  }
}
