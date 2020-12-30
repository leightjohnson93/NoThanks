import app from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyCHHniXy9QLAKzS825_F0CE7RRDOQ2MPK8',
  authDomain: 'no-thanks69.firebaseapp.com',
  projectId: 'no-thanks69',
  storageBucket: 'no-thanks69.appspot.com',
  messagingSenderId: '899326146338',
  appId: '1:899326146338:web:4d2ed55d1b02ca447d977b',
}

class Firebase {
  private db
  public id: string | null = null
  public players: string[]
  constructor() {
    app.initializeApp(config)
    this.db = app.database()
    this.players = []
  }

  private generateId() {
    const id = []
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < 4; i++) {
      id.push(CHARS.charAt(Math.floor(Math.random() * CHARS.length)))
    }
    return this.id = id.join('')
  }

  public createGame () {
    return this.db.ref('games').push(this.generateId()).key
  }

  public joinGame (name: string, id: string)  {
    this.db.ref('games/public/players').child(name).set({chips: 11, cards: [], turn: false})
  }

  public getPlayers(callback: (players: any) => void) {
    this.db.ref('games/public').on('value', snapshot => callback(snapshot.val()))
    return this.players
  }

  // startGame = (frequency, duration) => {
  //   const startTime = this.getUnixTime()
  //   this.db.ref(`games/${this.id}`).update({ frequency, duration, startTime })
  //   return startTime
  // }

  // getGame = (gameId) =>
  //   this.db
  //     .ref('games')
  //     .orderByChild('gameId')
  //     .equalTo(gameId)
  //     .once('value')
  //     .then((snapshot) => {
  //       const game = snapshot.val()
  //       if (game) {
  //         const id = Object.keys(game)[0]
  //         this.id = id
  //         return game[id]
  //       }
  //     })
  //     .catch((e) => console.log(e))
}

export default Firebase
