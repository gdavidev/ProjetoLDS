import { UserRegisterDTO, UserLoginDTO } from "./UserDTOs";

export default class User {
  id: number;
  userName?: string
  email?: string
  password?: string
  token?: string
  profilePic?: File

  constructor()  
  constructor(id?: number, userName?: string, token?: string, profilePic?: File, email?: string, password?: string) {
    this.id = id || 0;
    this.userName = userName || '';
    this.token = token || '';
    this.profilePic = profilePic || undefined;
    this.email = email || ''
    this.password = password || ''
  }

  isAuth(): boolean { 
    return this.token !== '' 
  }

  toRegisterDTO(): {} {
    const dto: UserRegisterDTO = {
      username: this.userName!,
      "e-mail": this.email!,
      password: this.password!,
      imagem_perfil: this.profilePic,
    }
    return dto;
  }

  toLoginDTO(): {} {
    const dto: UserLoginDTO = {
      "e-mail": this.email!,
      password: this.password!,
    }
    return dto;
  }
}