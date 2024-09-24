import { GameGetDTO } from "@models/GameDTOs";

export default class Game {
  id: number;
  name: string;
  desc: string;
  emulator: string;
  thumbnail?: File;
  thumbnailName?: string;
  thumbnailBase64?: string
  fileName?: string
  file?: File | string;
  
  constructor(id?: number, name?: string, desc?: string, emulator?: string, thumbnail?: File | string, file?: File | string) {
    this.id        = id       || 0;
    this.name      = name     || '';
    this.desc      = desc     || '';
    this.emulator  = emulator || '';

    if (file) {
      if (typeof file === 'string') {
        this.fileName = file;
      } else {
        this.file = file;
        this.fileName = file.name;
      }
    }
    if (thumbnail) {      
      if (typeof thumbnail === 'string') {
        this.thumbnailBase64 = thumbnail;
      } else {
        this.thumbnail = thumbnail;
        this.thumbnailName = thumbnail?.name;
      }
    }
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