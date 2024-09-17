import { GameGetDTO } from "@models/GameDTOs";

export default class Game {
  id: number;
  name: string;
  desc: string;
  emulator: string;
  thumbnail?: File | string;
  file?: File | string;
  
  constructor(id?: number, name?: string, desc?: string, emulator?: string, thumbnail?: File | string, file?: File | string) {
    this.id        = id       || 0;
    this.name      = name     || '';
    this.desc      = desc     || '';
    this.emulator  = emulator || '';
    this.thumbnail = thumbnail;
    this.file      = file;
  }
  
  static fromGetDTO(dto: GameGetDTO): Game {
    return new Game(
      dto.id,
      dto.title,
      dto.description,
      dto.emulador,
      dto.image_base64,
      dto.file_name
    )
  }
}