import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'

export default class User {
  id: number
  name: string
  profilePic: Thumbnail;

  constructor(id: number, name: string, profilePic?: Thumbnail) {
    this.id         = id;
    this.name       = name;
    this.profilePic = profilePic || new Thumbnail({ fallbackUrl: userImageNotFound });
  }
}