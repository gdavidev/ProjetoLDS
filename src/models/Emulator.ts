import * as DTO from '@models/EmulatorDTOs';

export default class Emulator {
  id: number;
  abbreviation: string;
  console: string;
  companyName: string;

  constructor(id?: number, abbreviation?: string, console?: string, companyName?: string) {
    this.id               = id           || 0;
    this.abbreviation     = abbreviation || "";
    this.console          = console      || "";
    this.companyName      = companyName  || "";
  }

  toCreateDTO(): DTO.EmulatorCreateDTO {
    return { 
      nome: this.abbreviation,
      console: this.console,
      empresa: this.companyName,
    }
  }

  toUpdateDTO(): DTO.EmulatorUpdateDTO {
    return {
      id: this.id,
      nome: this.abbreviation,
      console: this.console,
      empresa: this.companyName,
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
