export default class User {
  userName?: string
  token?: string

  constructor()
  constructor(userName?: string, token?: string) {
    this.userName = userName || '';
    this.token = token || '';
  }

  isAuth(): boolean { 
    return this.token !== '' 
  }
}