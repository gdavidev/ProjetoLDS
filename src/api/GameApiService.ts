import * as DTO from "@models/data/GameDTOs";
import Game from "@models/Game";
import ApiService from "./ApiService";
import Emulator from "@models/Emulator";
import Category from "@models/Category";
import { AxiosResponse } from 'axios'

export default class GameApiService {
  private static readonly endpoints = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  };

  static async getAll(emulators?: Emulator[], categories?: Category[]): Promise<Game[]> {
    const res: AxiosResponse<DTO.GameGetResponseDTO[]> = await ApiService.get(GameApiService.endpoints.get);
    const gamesData: DTO.GameGetResponseDTO[] = res.data;

    if (categories && emulators) {
      return gamesData.map((dto: DTO.GameGetResponseDTO) => {
        const emulator: Emulator | undefined = emulators.find(em => em.id === dto.emulador);
        const category: Category | undefined = categories.find(ca => ca.id === dto.categoria);
        return Game.fromGetDTO(dto, emulator, category);
      });
    } else {
      return gamesData.map(g => Game.fromGetDTO(g))
    }
  }

  static async get(id: number, categories?: Category[], emulators?: Emulator[]): Promise<Game> {
    const res: AxiosResponse<DTO.GameGetResponseDTO> = 
        await ApiService.get(GameApiService.endpoints.get, { data: { id: id } });

    let category: Category | undefined = undefined;
    let emulator: Emulator | undefined = undefined;
    if (categories)
      category = categories.find(cat => cat.id === res.data.categoria);
    if (emulators)
      emulator = emulators.find(em => em.id === res.data.emulador);

    return Game.fromGetDTO(res.data, emulator, category);
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