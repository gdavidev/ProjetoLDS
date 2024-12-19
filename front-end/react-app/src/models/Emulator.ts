import * as DTO from '@models/data/EmulatorDTOs';

export default class Emulator {
  id: number;
  abbreviation: string;
  console: string;
  companyName: string;

  constructor(
      abbreviation: string,
      console: string,
      companyName: string,
      id?: number)
  constructor(
      abbreviation: string,
      console: string,
      companyName: string,
      id: number = 0)
  {
    this.id               = id;
    this.abbreviation     = abbreviation;
    this.console          = console;
    this.companyName      = companyName;
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
      dto.nome,
      dto.console,
      dto.empresa,
      dto.id,
    )
  }
}
