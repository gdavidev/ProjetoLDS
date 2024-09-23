import { UserRegisterDTO, UserLoginDTO, UserLoginResponseDTO } from "@models/UserDTOs";

export default class CurrentUser {
  isAdmin?: boolean
  userName?: string
  email?: string
  password?: string
  token?: string
  profilePic?: File

  constructor()  
  constructor(userName: string, email: string, password?: string, token?: string, isAdmin?: boolean)  
  constructor(userName?: string, email?: string, password?: string, token?: string, isAdmin?: boolean, profilePic?: File) {
    this.userName   = userName;
    this.token      = token;
    this.profilePic = profilePic || undefined;
    this.email      = email;
    this.password   = password;
    this.isAdmin    = isAdmin;
  }

  isAuth(): boolean { 
    if (this.token)
      return true
    return false
  }

  toRegisterDTO(): {} {
    const dto: UserRegisterDTO = {
      username: this.userName!,
      email: this.email!,
      password: this.password!,
      imagem_perfil: this.profilePic,
    }
    return dto;
  }

  toLoginDTO(): {} {
    const dto: UserLoginDTO = {
      email: this.email!,
      password: this.password!,
    }
    return dto;
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