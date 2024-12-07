import { UserLoginResponseDTO } from '@models/data/UserDTOs';
import { Role } from '@/hooks/usePermission.ts';
import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'

export default class CurrentUser {
  id: number;
  userName: string;
  email: string;
  token: string;
  profilePic: Thumbnail;
  role: Role;

  constructor(id: number, userName: string, token: string, email: string, role: Role, profilePic?: Thumbnail) {
    this.id         = id;
    this.userName   = userName;
    this.token      = token;
    this.email      = email;
    this.role       = role;
    this.profilePic = profilePic || new Thumbnail({ url: userImageNotFound });
  }

  static fromLoginResponseDTO(dto: UserLoginResponseDTO): CurrentUser {
    return new CurrentUser(
      dto.user.id,
      dto.user.username,
      dto.token,
      dto.user.email,
      dto.user.admin ? Role.ADMIN : Role.USER,
    )
  }
}