export type GameCreateResponseDTO ={
  id: number,
  title: string,
  description: string,
  emulador: string,
  image_name: string,
  file_name: string,
}

export type GameGetDTO = {
  description: string,
  id: number,
  emulador: string,
  image_base64: string,
  file: string,
  title: string,
}