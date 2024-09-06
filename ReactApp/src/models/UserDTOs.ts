export type UserRegisterDTO = {
  username: string,
	"e-mail": string,
	password: string,
	imagem_perfil: File | undefined,
}

export type UserLoginDTO = {
  "e-mail": string,
	password: string,
}