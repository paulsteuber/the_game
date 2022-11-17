export default class CardHelper {
  constructor() {
  }
  //Mix all array items randomly
  static mix(arr: number[]) {
    for (let i:number = arr.length - 1; i > 0; i--) {
      const j:number = Math.floor(Math.random() * (i + 1));
      const temp: number = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
  static cardsPerPlayer(playersCount: number){
    switch(playersCount) {
      case 4:
        return 7
        break;
      case 5:
        return 6
        break;
      default:
        return 6
    } 
  }
}