export type UserRegisterDTO = {
  username: string,
	email: string,
	password: string,
	imagem_perfil: File | undefined,
}

export type UserLoginDTO = {
  email: string,
	password: string,
}

export type UserLoginResponseDTO = {
  token: string
	user: {
		admin: boolean,
		email: string,
		username: string
	}	
}