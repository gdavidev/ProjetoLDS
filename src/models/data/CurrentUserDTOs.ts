import { UseGetResponseDTO } from '@models/data/UserDTOs.ts';

/* REGISTER */
export type CurrentUserRegisterDTO = {
  username: string,
	email: string,
	password: string,
	imagem_perfil?: File | undefined,
}
export type CurrentUserRegisterResponseDTO = {
}

/* LOGIN */
export type CurrentUserLoginDTO = {
  email: string,
	password: string,
}
export type CurrentUserLoginResponseDTO = {
  token: string
	user: UseGetResponseDTO
}

/* RESET PASSWORD */
export type CurrentUserResetPasswordDTO = {
	newPassword: string
}
export type CurrentUserResetPasswordResponseDTO = {
}

/* FORGOT PASSWORD */
export type CurrentUserForgotPasswordDTO = {
	email: string
}
export type CurrentUserForgotPasswordResponseDTO = {
}

/* UPDATE */
export type CurrentUserUpdateDTO = {
	username?: string,
	email?: string,
	password?: string,
	imagem_perfil?: File | undefined,
}
export type CurrentUserUpdateResponseDTO = {
	username: string,
	email: string,
	password: string,
}