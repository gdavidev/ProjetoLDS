export type GameCreateDTO = {
  title: string,
  description: string,
  emulador: string,
  image: File,
  file: File,
}

export type GameUpdateDTO = {
  rom_id: number,
  title?: string,
  description?: string,
  emulador?: string,
  image?: File,
  file?: File,
}