import * as DTO from "@models/data/GameDTOs";
import Game from "@models/Game";
import ApiService from "./ApiService";
import { AxiosResponse } from 'axios'

export default class GameApiService {
  private static readonly endpoints = {
    get: 'api/roms/',
    detail: 'api/roms/detail/',
		search: 'api/roms/search/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  };

  static async getAll(): Promise<Game[]> {
    const res: AxiosResponse<DTO.GameGetResponseDTO[]> = await ApiService.get(GameApiService.endpoints.get);
    return res.data.map(g => Game.fromGetDTO(g))
  }

  static async get(id: number): Promise<Game> {
    const res: AxiosResponse<DTO.GameGetResponseDTO> = await ApiService.get(
        GameApiService.endpoints.detail, {
          params: { rom_id: id }
        });
    return Game.fromGetDTO(res.data);
  }

	static async search(search: string): Promise<Game[]> {
		const res: AxiosResponse<{ roms: DTO.GameGetResponseDTO[] }> = await ApiService.get(
				GameApiService.endpoints.search, {
					params: { search: search }
				});
		return res.data.roms.map(g => Game.fromGetDTO(g))
	}
  
  static async store(game: Game, token: string): Promise<Game> {
    if (game.id === 0) {
      return await this.post(game, token);
    } else {
      await this.put(game, token);
      return game;
    }
  }

  public static async delete(game: Game, token: string): Promise<void> {    
    await ApiService.delete(GameApiService.endpoints.delete,{ 
        params: game.toDeleteDTO(),
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
  }

  private static async post(game: Game, token: string): Promise<Game> {    
    const res: AxiosResponse<DTO.GameCreateResponseDTO> = await ApiService.post(
        GameApiService.endpoints.post,
        game.toCreateDTO(),
        { headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data'
        }}
      );
    game.id = res.data.rom_id;
    return game;
  }

  private static async put(game: Game, token: string): Promise<void> {    
    await ApiService.put(
        GameApiService.endpoints.put,
        game.toUpdateDTO(),
        { headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data'
        }}
      );
  }
}