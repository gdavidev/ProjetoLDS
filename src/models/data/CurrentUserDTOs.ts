/* REGISTER */
export type UserRegisterDTO = {
  username: string,
	email: string,
	password: string,
	imagem_perfil?: File | undefined,
}
export type UserRegisterResponseDTO = {
}

/* LOGIN */
export type UserLoginDTO = {
  email: string,
	password: string,
}
export type UserLoginResponseDTO = {
  token: string
	user: {
		id: number,
		admin: boolean,
		email: string,
		username: string,
		img_perfil: string,
		is_active: boolean,
		is_banned: boolean,
	}	
}

/* RESET PASSWORD */
export type UserResetPasswordDTO = {
	newPassword: string
}
export type UserResetPasswordResponseDTO = {
}

/* FORGOT PASSWORD */
export type UserForgotPasswordDTO = {
	email: string
}
export type UserForgotPasswordResponseDTO = {
}

/* UPDATE */
export type UserUpdateDTO = {
	username?: string,
	email?: string,
	password?: string,
	imagem_perfil?: File | undefined,
}
export type UserUpdateResponseDTO = {
	username: string,
	email: string,
	password: string,
}