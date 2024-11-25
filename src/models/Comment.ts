import User from "./User";

export default class Comment {
  id: number;
  owner: User;
  content: string;
  likes: number;
  date: Date;

  constructor(id?: number, owner?: User, content?: string, likes?: number, date?: Date) {
    this.id        = id        || 0;
    this.owner     = owner     || new User();
    this.content   = content   || '';
    this.likes     = likes     || 0;
    this.date      = date      || new Date();
  }
}