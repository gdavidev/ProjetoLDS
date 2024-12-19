import * as DTO from "@models/data/EmulatorDTOs";
import Emulator from "@models/Emulator";
import ApiService from "./ApiService";
import { AxiosResponse } from 'axios'

export default class EmulatorApiService {
  private static endpoints = {
    get: 'api/emuladores/',
    post: 'api/emulador/create/',
    put: 'api/emulador/update/',
    delete: 'api/emulador/delete/',
  };

  static async getAll(): Promise<Emulator[]> {
    const res: AxiosResponse<DTO.EmulatorGetResponseDTO[]> =
        await ApiService.get(EmulatorApiService.endpoints.get);
    return res.data.map(dto => Emulator.fromGetDTO(dto));
  }

  static async get(id: number): Promise<Emulator> {
    const res: AxiosResponse<DTO.EmulatorGetResponseDTO> = 
        await ApiService.get(EmulatorApiService.endpoints.get, { data: { id: id } });
    return Emulator.fromGetDTO(res.data);
  }  
  
  static async store(emulator: Emulator, token: string): Promise<Emulator> {
    if (emulator.id === 0) {
      return await this.post(emulator, token);
    } else {
      await this.put(emulator, token);
      return emulator;
    }
  }

  public static async delete(emulator: Emulator, token: string): Promise<void> {
    await ApiService.delete(EmulatorApiService.endpoints.delete, {
       params: emulator.toDeleteDTO(),
       headers: { 'Authorization': "Bearer " + token }
      });
  }

  private static async post(emulator: Emulator, token: string): Promise<Emulator> {
    const res: AxiosResponse<DTO.EmulatorCreateResponseDTO> = await ApiService.post(
      EmulatorApiService.endpoints.post,
      emulator.toCreateDTO(),
      { headers: { 
        'Authorization': "Bearer " + token,
        'Content-type': 'multipart/form-data'
      }}
    );
    emulator.id = res.data.id;
    return emulator;
  }

  private static async put(emulator: Emulator, token: string): Promise<void> {    
    await ApiService.put(
      EmulatorApiService.endpoints.put,
      emulator.toUpdateDTO(),
      { headers: { 
        'Authorization': "Bearer " + token,
        'Content-type': 'multipart/form-data'
      }}
    );    
  }
}