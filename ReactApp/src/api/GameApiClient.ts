import * as DTO from "@/models/GameDTOs";
import Game from "@models/Game";
import ApiService, { Endpoints } from "./ApiService";
import EmulatorApiClient from "./EmulatorApiClient";
import Emulator from "@/models/Emulator";
import Category from "@/models/Category";
import CategoryApiClient from "./CategoryApiClient";

export default class GameApiClient {
  private apiService: ApiService;
  private static endpoints: Endpoints = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  };

  constructor(token?: string) {
    this.apiService = new ApiService(GameApiClient.endpoints, token)
  }

  async getAll(): Promise<Game[]> {
    const games: Game[] = [];

    const emulatorApiClient: EmulatorApiClient = new EmulatorApiClient();
    const emulators: Emulator[] = await emulatorApiClient.getAll();

    const categoryApiClient: CategoryApiClient = new CategoryApiClient();
    const categories: Category[] = await categoryApiClient.getAll();

    const gamesData: DTO.GameGetResponseDTO[] = await this.apiService.getAll<DTO.GameGetResponseDTO>();

    for (let i = 0; i < gamesData.length; i++) {
      const emulator: Emulator | undefined = emulators.find(em => em.id === gamesData[i].emulador);
      const category: Category | undefined = categories.find(ca => ca.id === gamesData[i].categoria);
      const game: Game = Game.fromGetDTO(gamesData[i], emulator, category);

      games.push(game);
    }

    return games;
  }

  async get(id: number): Promise<Game> {
    const data: DTO.GameGetResponseDTO = await this.apiService.get<DTO.GameGetResponseDTO>(id);
    const game = Game.fromGetDTO(data);
    return game;
  }  
  
  async store(game: Game): Promise<Game> {
    if (game.id === 0) {
      return await this.post(game);
    } else {
      await this.put(game);
      return game;
    }
  }

  public async delete(game: Game): Promise<void> {
    await this.apiService.delete<DTO.GameDeleteDTO, DTO.GameDeleteResponseDTO>(game.toDeleteDTO());
  }

  private async post(game: Game): Promise<Game> {
    this.apiService.headers = {
      ...this.apiService.headers,
      'Content-Type': 'multipart/form-data'
    }
    const response: DTO.GameCreateResponseDTO = 
      await this.apiService.post<DTO.GameCreateDTO, DTO.GameCreateResponseDTO>(game.toCreateDTO());
    game.id = response.rom_id;
    return game;
  }

  private async put(game: Game): Promise<void> {
    this.apiService.headers = {
      ...this.apiService.headers,
      'Content-Type': 'multipart/form-data'
    } 
    await this.apiService.put<DTO.GameUpdateDTO, DTO.GameCreateResponseDTO>(game.toUpdateDTO());    
  }
}