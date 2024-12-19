import { UserLoginResponseDTO } from '@models/data/UserDTOs';
import { Role } from '@/hooks/usePermission.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';

export default class CurrentUser {
  userName: string
  email: string
  token: string
  profilePic: Thumbnail | undefined
  role: Role

  constructor(userName: string, token: string, email: string, role: Role, profilePic?: Thumbnail) {
    this.userName   = userName;
    this.token      = token;
    this.email      = email;
    this.role       = role;
    this.profilePic = profilePic;
  }

  static fromLoginResponseDTO(dto: UserLoginResponseDTO): CurrentUser {
    return new CurrentUser(
      dto.user.username,
      dto.token,
      dto.user.email,
      dto.user.admin ? Role.ADMIN : Role.USER,
    )
  }
}