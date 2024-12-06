import Thumbnail from '@models/utility/Thumbnail.ts';
import userImageNotFound from '@/assets/media/user-image-not-found.webp'

export default class User {
  id: number
  name: string
  image: Thumbnail;

  constructor(id: number, name: string, image: string) {
    this.id     = id;
    this.name   = name;
    this.image  = new Thumbnail({ base64: image, fallbackUrl: userImageNotFound });
  }
}