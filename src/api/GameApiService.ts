import * as DTO from "@models/data/GameDTOs";
import Game from "@models/Game";
import ApiService from "./ApiService";
import EmulatorApiService from "./EmulatorApiService";
import Emulator from "@models/Emulator";
import Category from "@models/Category";
import CategoryApiService from "./CategoryApiService";
import { AxiosResponse } from 'axios'

export default class GameApiService {
  private static readonly endpoints = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  };

  static async getAll(): Promise<Game[]> {
    const games: Game[] = [];

    const emulators: Emulator[] = await EmulatorApiService.getAll();
    const categories: Category[] = await CategoryApiService.getAll();

    const res: AxiosResponse<DTO.GameGetResponseDTO[]> = await ApiService.get(GameApiService.endpoints.get);
    const gamesData: DTO.GameGetResponseDTO[] = res.data;

    for (let i = 0; i < gamesData.length; i++) {
      const emulator: Emulator | undefined = emulators.find(em => em.id === gamesData[i].emulador);
      const category: Category | undefined = categories.find(ca => ca.id === gamesData[i].categoria);
      const game: Game = Game.fromGetDTO(gamesData[i], emulator, category);

      games.push(game);
    }

    return games;
  }

  static async get(id: number): Promise<Game> {
    const res: AxiosResponse<DTO.GameGetResponseDTO> = 
        await ApiService.get(GameApiService.endpoints.get, { data: { id: id } });
    return Game.fromGetDTO(res.data);
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