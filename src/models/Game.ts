import * as DTO from "@models/data/GameDTOs";
import Emulator from "@models/Emulator";
import Category from "@models/Category";
import Thumbnail from "@models/utility/Thumbnail";
import imageNotFound from '@/media/image-not-found.png'

export default class Game {
  id: number;
  name: string;
  desc: string;
  emulator: Emulator;
  category: Category;
  thumbnail: Thumbnail;
  file: File | null;
  
  constructor(id?: number, name?: string, desc?: string, emulator?: Emulator, thumbnail?: Thumbnail | null, file?: File | null, category?: Category) {
    this.id           = id          || 0;
    this.name         = name        || '';
    this.desc         = desc        || '';
    this.emulator     = emulator    || new Emulator();
    this.category     = category    || new Category();
    this.thumbnail    = thumbnail   || new Thumbnail({ url: imageNotFound });
    this.file         = file        || null;
  }

  getDesktopAppQueryString() {
    return "emuhub://" +
       this.emulator?.companyName + "|" +
       this.emulator?.abbreviation.toUpperCase() + "|" +
       this.file!.name;
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

  static fromGetDTO(dto: DTO.GameGetResponseDTO): Game {
    return new Game(
      dto.id,
      dto.title,
      dto.description,
      new Emulator(dto.emulador.id, dto.emulador.nome, dto.emulador.console, dto.emulador.empresa),
      new Thumbnail({ base64: dto.image_base64 }),
      new File([], dto.file),
      new Category(dto.categoria.id, dto.categoria.nome),
    )
  }
}