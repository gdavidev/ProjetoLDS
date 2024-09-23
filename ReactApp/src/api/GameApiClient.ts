import Game from "@models/Game";
import Axios from 'axios'

export default class GameApiClient {
  hostIp: string = "http://localhost:8080/"
  bearerToken: string = ''
  endpoints = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  }

  setToken(token: string) {
    this.bearerToken = token
  }

  async getAll<DTO>(): Promise<DTO[]> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const response = await Axios.get<DTO[]>(targetUrl)    
    return response.data
  }

  async get<DTO>(id: number): Promise<DTO> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const urlParameters: string = `id=${id}`
    const response = await Axios.get<DTO>(targetUrl + urlParameters)
    return response.data
  }  
  
  async store<T>(game: Game): Promise<T | any> {    
    const data = new FormData()    
    let targetUrl: string = ''
    let method: string = ''
    
    if (game.id !== 0) {
      data.append('rom_id', game.id.toString())
      targetUrl = this.hostIp + this.endpoints.put
      method = 'PUT'
    } else {
      targetUrl = this.hostIp + this.endpoints.post
      method = 'POST'
    }
    data.append('title', game.name)
    data.append('description', game.desc)
    data.append('emulador', game.emulator)
    if (game.thumbnail instanceof File)
      data.append('image', game.thumbnail)
    if (game.file instanceof File)
      data.append('file', game.file)

    const response = await Axios({
      method: method,
      url: targetUrl,
      headers: {
        'Authorization': this.bearerToken ? 'Bearer ' + this.bearerToken : '', 
      },
      data: data,      
    })
    return response.data as T | any
  }

  async delete(gameId: number) {
    const targetUrl: string = this.hostIp + this.endpoints.delete
    const response = await Axios({
      method: 'DELETE',
      url: targetUrl,
      headers: {
        'Authorization': this.bearerToken ? 'Bearer ' + this.bearerToken : '', 
      },
      data: { 'rom_id': gameId }
    })
    return response.data
  }
}