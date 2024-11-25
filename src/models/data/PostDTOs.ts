/* CREATE */
export type PostCreateResponseDTO = {
  id: number
}
export type PostCreateDTO = {
}

/* UPDATE */
export type PostUpdateDTO = {
}
export type PostUpdateResponseDTO = {}

/* DELETE */
export type PostDeleteDTO = {
}
export type PostDeleteResponseDTO = {}

/* GET */
export type PostGetDTO = {  
  id: number,
  nome: string
}
export type PostGetResponseDTO = {
  id: number,
  nome: string
  likes: number,
  content: string,
  lastUpdate: Date
}