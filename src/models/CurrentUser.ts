import { UserRegisterDTO, UserLoginDTO, UserLoginResponseDTO } from "@models/data/UserDTOs";

export default class CurrentUser {
  isAdmin?: boolean
  userName?: string
  email?: string
  password?: string
  token?: string
  profilePic?: File

  constructor(userName?: string, email?: string, password?: string, token?: string, isAdmin?: boolean, profilePic?: File) {
    this.userName   = userName;
    this.token      = token;
    this.profilePic = profilePic || undefined;
    this.email      = email;
    this.password   = password;
    this.isAdmin    = isAdmin;
  }

  isAuth(): boolean {
    return !!this.token
  }

  toRegisterDTO(): UserRegisterDTO {
    return {
      username: this.userName!,
      email: this.email!,
      password: this.password!,
      imagem_perfil: this.profilePic,
    }
  }

  toLoginDTO(): UserLoginDTO {
    return {
      email: this.email!,
      password: this.password!,
    }
  }

  static fromLoginResponseDTO(dto: UserLoginResponseDTO): CurrentUser {
    return new CurrentUser(
      dto.user.username,
      dto.user.email,
      '',
      dto.token,
      dto.user.admin
    )
  }
}