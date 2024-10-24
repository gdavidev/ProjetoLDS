import * as DTO from "@models/EmulatorDTOs";
import Emulator from "@models/Emulator";
import ApiService, { Endpoints } from "./ApiService";

export default class EmulatorApiClient {
  private apiService: ApiService;
  private static endpoints: Endpoints = {
    get: 'api/emuladores/',
    post: 'api/emuladores/create/',
    put: 'api/emuladores/update/',
    delete: 'api/emuladores/delete/',
  };

  constructor(token?: string) {
    this.apiService = new ApiService(EmulatorApiClient.endpoints, token)
  }

  async getAll(): Promise<Emulator[]> {
    const data: DTO.EmulatorGetResponseDTO[] = await this.apiService.getAll<DTO.EmulatorGetResponseDTO>();
    const emulators: Emulator[] = data.map(dto => Emulator.fromGetDTO(dto));
    return emulators;
  }

  async get(id: number): Promise<Emulator> {
    const data: DTO.EmulatorGetResponseDTO = await this.apiService.get<DTO.EmulatorGetResponseDTO>(id);
    const emulator = Emulator.fromGetDTO(data);
    return emulator;
  }  
  
  async store(emulator: Emulator): Promise<Emulator> {
    if (emulator.id === 0) {
      return await this.post(emulator);
    } else {
      await this.put(emulator);
      return emulator;
    }
  }

  public async delete(emulator: Emulator): Promise<void> {
    await this.apiService.delete<DTO.EmulatorDeleteDTO, DTO.EmulatorDeleteResponseDTO>(emulator.toDeleteDTO());
  }

  private async post(emulator: Emulator): Promise<Emulator> {
    const response: DTO.EmulatorCreateResponseDTO = 
      await this.apiService.post<DTO.EmulatorCreateDTO, DTO.EmulatorCreateResponseDTO>(emulator.toCreateDTO());
    emulator.id = response.id;
    return emulator;
  }

  private async put(emulator: Emulator): Promise<void> {    
    await this.apiService.put<DTO.EmulatorUpdateDTO, DTO.EmulatorCreateResponseDTO>(emulator.toUpdateDTO());    
  }
}