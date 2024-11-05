import * as DTO from '@models/data/EmulatorDTOs';

export default class Emulator {
  id: number;
  abbreviation: string;
  console: string;
  companyName: string;
  file: File;

  constructor(id?: number, abbreviation?: string, console?: string, companyName?: string, file?: File) {
    this.id               = id           || 0;
    this.abbreviation     = abbreviation || "";
    this.console          = console      || "";
    this.companyName      = companyName  || "";
    this.file             = file         || new File([], '')
  }

  toCreateDTO(): DTO.EmulatorCreateDTO {
    return { 
      nome: this.abbreviation,
      console: this.console,
      empresa: this.companyName,
      emu_file: this.file,
    }
  }

  toUpdateDTO(): DTO.EmulatorUpdateDTO {
    return {
      id: this.id,
      nome: this.abbreviation,
      console: this.console,
      empresa: this.companyName,
      emu_file: this.file,
    }
  }

  toDeleteDTO(): DTO.EmulatorDeleteDTO {
    return { id: this.id }
  }

  static fromGetDTO(dto: DTO.EmulatorGetResponseDTO): Emulator {
    return new Emulator(
      dto.id,
      dto.nome,
      dto.console,
      dto.empresa,
    )
  }
}
