import { EmulatorGetResponseDTO } from '@models/data/EmulatorDTOs.ts';
import { CategoryGetResponseDTO } from '@models/data/CategoryDTOs.ts';

/* CREATE */
export type GameCreateResponseDTO ={
  rom_id: number,
  title: string,
  description: string,
  emulador: string,
  image_name: string,
  file_name: string,
}
export type GameCreateDTO = {
  title: string,
  description: string,
  emulador: number,
  categoria: number,
  image?: File,
  file?: File,
}

/* UPDATE */
export type GameUpdateDTO = {
  rom_id: number,
  title: string,
  description: string,
  emulador: number,
  categoria: number,
  image?: File,
  file?: File,
}
export type GameUpdateResponseDTO = {

}

/* DELETE */
export type GameDeleteDTO = {
  rom_id: number
}
export type GameDeleteResponseDTO = {

}

/* GET */
export type GameGetDTO = {  
  id: number,
}
export type GameGetResponseDTO = {
  description: string,
  id: number,
  image_base64: string,
  file: string,
  title: string,
  emulador: EmulatorGetResponseDTO,
  categoria: CategoryGetResponseDTO,
}





