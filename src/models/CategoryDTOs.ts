/* CREATE */
export type CategoryCreateResponseDTO ={
  id: number,
  nome: string,
}
export type CategoryCreateDTO = {
  nome: string,
}

/* UPDATE */
export type CategoryUpdateDTO = {
  id: number,
  nome: string,
}
export type CategoryUpdateResponseDTO = {}

/* DELETE */
export type CategoryDeleteDTO = {
  id: number
}
export type CategoryDeleteResponseDTO = {}

/* GET */
export type CategoryGetDTO = {  
  id: number,
}
export type CategoryGetResponseDTO = {
  id: number,
  nome: string,
}