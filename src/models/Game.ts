import * as DTO from "@models/GameDTOs";
import Emulator from "@models/Emulator";
import Category from "@models/Category";
import Thumbnail from "@models/Thumbnail";

export default class Game {
  id: number;
  name: string;
  desc: string;
  emulator: Emulator;
  category: Category;
  thumbnail: Thumbnail | null;
  file: File | null;
  
  constructor(id?: number, name?: string, desc?: string, emulator?: Emulator, thumbnail?: Thumbnail, file?: File, category?: Category) {
    this.id           = id          || 0;
    this.name         = name        || '';
    this.desc         = desc        || '';
    this.emulator     = emulator    || new Emulator();
    this.category     = category    || new Category();
    this.thumbnail    = thumbnail   || null;
    this.file         = file        || null;
  }

  getDesktopAppQueryString() {
    const fileExtension: string = this.file?.name.substring(this.file?.name.indexOf('.'), this.file?.name.length)!

    return "emuhub://" +
       this.emulator?.companyName + "|" +
       this.emulator?.abbreviation.toUpperCase() + "|" +
       this.name + fileExtension;
  }
  
  toCreateDTO(): DTO.GameCreateDTO {
    return {
      title: this.name,
      description: this.desc,
      emulador: this.emulator?.id  || 0,
      categoria: this.category?.id || 0,
      image: this.thumbnail?.file     || undefined,
      file: this.file                 || undefined,
    }
  }

  toUpdateDTO(): DTO.GameUpdateDTO {
    return {
      rom_id: this.id,
      title: this.name,
      description: this.desc,
      emulador: this.emulator?.id  || 0,
      categoria: this.category?.id || 0,
      image: this.thumbnail?.file     || undefined,
      file: this.file                 || undefined,
    }
  }

  toDeleteDTO(): DTO.GameDeleteDTO {
    return {
      rom_id: this.id
    }
  }

  static fromGetDTO(dto: DTO.GameGetResponseDTO, emulator?: Emulator, category?: Category): Game {
    return new Game(
      dto.id,
      dto.title,
      dto.description,
      emulator,
      new Thumbnail(dto.image_base64),
      new File([], dto.file),
      category,
    )
  }
}