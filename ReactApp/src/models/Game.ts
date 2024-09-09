import IDataTransferObject from "../api/IDataTransferObject";
import { GameCreateDTO, GameUpdateDTO, GameGetDTO } from "./GameDTOs";

export default class Game implements IDataTransferObject {
  id: number;
  name: string;
  desc: string;
  emulator: string;
  thumbnail: File | undefined;
  file: File | undefined;
  
  constructor(id?: number, name?: string, desc?: string, emulator?: string, thumbnail?: File, file?: File) {
    this.id        = id       || 0;
    this.name      = name     || '';
    this.desc      = desc     || '';
    this.emulator  = emulator || '';
    this.thumbnail = thumbnail;
    this.file      = file;
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

  static fromGetDTO(dto: GameGetDTO): Game {
    return new Game(
      dto.id,
      dto.title,
      dto.description,
      dto.emulador,
      dto.image,
      dto.file
    )
  }
}