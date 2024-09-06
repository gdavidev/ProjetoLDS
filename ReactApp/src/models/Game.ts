import IDataTransferObject from "../api/IDataTransferObject";
import { GameCreateDTO, GameUpdateDTO } from "./GameDTOs";

export default class Game implements IDataTransferObject {
  id: number;
  name: string;
  desc: string;
  emulator: string;
  thumbnail: File | undefined;
  file: File | undefined;
  
  constructor(id: number, name: string, desc: string, emulator: string, thumbnail?: File | undefined, file?: File | undefined) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.emulator = emulator;
    this.thumbnail = thumbnail;
    this.file = file;
  }

  toCreateDTO(): GameCreateDTO {
    const dto: GameCreateDTO = {
      title: this.name,
      description: this.desc,
      emulador: this.emulator,
      image: this.thumbnail!,
      file: this.file!,
    }
    return dto;
  }

  toUpdateDTO(): GameUpdateDTO {
    const dto: GameUpdateDTO = {
      rom_id: this.id,
      title: this.name,
      description: this.desc,
      emulador: this.emulator,
      image: this.thumbnail,
      file: this.file,
    }
    return dto;
  }
}