import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'
import CurrentUser from '@models/CurrentUser.ts';
import * as DTO from '@models/data/UserDTOs.ts';

export default class User {
  id: number
  name: string
  profilePic: Thumbnail;

  constructor(id: number, name: string, profilePic?: Thumbnail) {
    this.id         = id;
    this.name       = name;
    if (profilePic) {
      profilePic.fallbackUrl = userImageNotFound;
      this.profilePic = profilePic;
    } else {
      this.profilePic = new Thumbnail({ fallbackUrl: userImageNotFound });
    }
  }

  static fromCurrentUser(user: CurrentUser): User {
    return new User(
        user.id,
        user.userName,
        user.profilePic,
    );
  }

  static fromGetDTO(dto: DTO.UseGetResponseDTO): User {
    return new User(
        dto.id,
        dto.username,
        new Thumbnail({ base64: dto.img_perfil }),
    );
  }
}