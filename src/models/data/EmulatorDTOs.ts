/* CREATE */
export type EmulatorCreateResponseDTO ={
  id: number,
  nome: string,
  console: string,
  empresa: string,
}
export type EmulatorCreateDTO = {
  nome: string,
  console: string,
  empresa: string,
}

/* UPDATE */
export type EmulatorUpdateDTO = {
  id: number,
  nome: string,
  console: string,
  empresa: string,
}
export type EmulatorUpdateResponseDTO = {}

/* DELETE */
export type EmulatorDeleteDTO = {
  id: number
}
export type EmulatorDeleteResponseDTO = {}

/* GET */
export type EmulatorGetDTO = {  
  emulador_id: number,
}
export type EmulatorGetResponseDTO = {
  id: number,
  nome: string,
  console: string,
  empresa: string,
}