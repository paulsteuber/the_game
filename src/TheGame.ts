import { Game, Player, PlayerCard, Stack } from "./types";
import CardHelper from "./utilities/CardHelper";

export default class TheGame {
  constructor() {}

  static getNewGame(): Game {
    return {
      status: {
        allowUserToPlay: true,
        gameOver: false,
        playerCountOverlayHide: false
      },
      initialized: false,
      players: [],
      stacks: [
        { id: 0, up: true, cards: [1] },
        { id: 1, up: true, cards: [1] },
        { id: 2, up: false, cards: [100] },
        { id: 3, up: false, cards: [100] },
      ],
      refillStack: CardHelper.mix([...Array(98).keys()].map((i) => i + 2)),
      history: []
    };
  }
  static initPlayers(playerCount: number): Player[] {
    let players: Player[] = [];
    let playerNames = ["Anna", "Ben", "Charles", "Daniela", "Erica", "Florian", "Gerald", "Hannah" ]
    for (let i = 0; i < playerCount; i++) {
      const index = Math.floor(Math.random() * playerNames.length);

      // Remove the element at the random index
      const name = playerNames.splice(index, 1)[0];
      let newPlayer = {
        name: name,
        lastMoveCardsCount: 0,
        cards: [],
      };
      players.push(newPlayer);
    }
    return players;
  }
  static drawNewCards(playerID: number, game: Game):Game{
      const cardsPerPlayer = CardHelper.cardsPerPlayer(game.players.length);
      const player = game.players[playerID];

      const usersCardsCount = player.cards.length;
      cardsPerPlayer - usersCardsCount < 2 ? alert("ERROR "+playerID+" has more cards than allowed"):"";
      for (let i = 0; i < cardsPerPlayer - usersCardsCount; i++) {
        const nextRefillCard =game.refillStack.shift();
        if (nextRefillCard) {
          const drawnCard: PlayerCard = {
            value: nextRefillCard,
            stackStatus: { a: true, b: true, c: true, d: true },
          };
          player.cards.push(drawnCard);
        }
      }
      player.cards = CardHelper.sortCards(player.cards);

      //refresh card status
      game.players = TheGame.refreshPlayerCardsStatus(
        game.players,
        game.stacks
      );
      return game;


  }
  static addHistoryEntry(game: Game, playerId: number, playedCard: number, stack: Stack):Game{
    game.history.push({
      player: playerId,
      playedCard: playedCard,
      stack: JSON.parse(JSON.stringify(stack))
    });
    return game;
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
      game.players[p].lastMoveCardsCount = game.players[p].cards.length
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
  static generateCardStatus(cardValue: number, stack: Stack): boolean | 10{
    if(!this.isCardAllowed(cardValue, stack)) return false;
    if(this.isCardTenBagger(cardValue, stack)) return 10;
    return true;
  }
  static refreshPlayerCardsStatus(
    players: Player[],
    stacks: Stack[]
  ): Player[] {
    const refreshedPlayerCards = players.map((player) => {
      const refreshedCards = player.cards.map((card) => {
        card.stackStatus = {
          a: this.generateCardStatus(card.value, stacks[0]),
          b: this.generateCardStatus(card.value, stacks[1]),
          c: this.generateCardStatus(card.value, stacks[2]),
          d: this.generateCardStatus(card.value, stacks[3]),
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
    if (game.players[0].cards.length <= game.players[0].lastMoveCardsCount - minimumPlayedCards) {
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
  static otherPlayersHaveCards(players: Player[]):boolean{
    players.forEach(player => {
      if(player.cards.length) return true
    });
    return false
  }
  static checkPlayersAreWinner(game: Game):boolean{
    const playerWithCards = game.players.filter(p => p.cards.length > 0);
    if(playerWithCards.length === 0 && game.refillStack.length === 0){
      return true;
    }
    return false;
  }
}
