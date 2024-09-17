import Axios from 'axios';
import CurrentUser from "@models/User";
import { UserLoginDTO, UserLoginResponseDTO } from '@models/UserDTOs';

export default class UserApiClient {
  private readonly hostIp: string = "http://localhost:8080/";
  private readonly endpoints = {
    get: 'api/user/',
    login: 'api/token/',
    register: 'api/register/',
    put: 'api/users/update/',
    delete: 'api/users/delete/',
  }

  // TODO: get DTO type as generic
  async register(user: CurrentUser): Promise<string> {
    const targetUrl: string = this.hostIp + this.endpoints.register
    const response = await Axios.post(targetUrl, user.toRegisterDTO())
    return response.data;
  }
    
  async login(userDTO: UserLoginDTO): Promise<CurrentUser> {
    const targetUrl: string = this.hostIp + this.endpoints.login
    const response = await Axios.post<UserLoginResponseDTO>(targetUrl, userDTO)
    return CurrentUser.fromLoginResponseDTO(response.data);
  }

  async update(user: CurrentUser): Promise<void> {

  }

  async delete(user: CurrentUser): Promise<void> {

  }
}