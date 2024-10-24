import Axios from 'axios';
import CurrentUser from "@models/User";
import * as DTO from '@models/UserDTOs';
import ApiService from './ApiService';

export default class UserApiClient {
  private readonly endpoints = {
    get: 'api/user/',
    login: 'api/token/',
    register: 'api/register/',
    forgotPassword: 'api/forgot-password/',
    resetPassword: 'api/reset-password/',
    put: 'api/users/update/',
    delete: 'api/users/delete/',
  }

  async register(dto: DTO.UserRegisterDTO): Promise<string> {
    const response = await Axios.post(ApiService.apiUrl + this.endpoints.register, dto);
    return response.data;
  }
    
  async login(dto: DTO.UserLoginDTO): Promise<CurrentUser> {
    const response = await Axios.post<DTO.UserLoginResponseDTO>(ApiService.apiUrl + this.endpoints.login, dto);
    return CurrentUser.fromLoginResponseDTO(response.data);
  }

  async forgotPassword(dto: DTO.UserForgotPasswordDTO): Promise<void> {    
    await Axios.post<DTO.UserForgotPasswordResponseDTO>(
      ApiService.apiUrl + this.endpoints.forgotPassword,
      { email: dto.email }
    )
  }

  async resetPassword(dto: DTO.UserResetPasswordDTO, token: string) {
    await Axios.post<DTO.UserResetPasswordResponseDTO>(
      ApiService.apiUrl + this.endpoints.resetPassword,
      { password: dto.newPassword },
      { headers:  { 'Authorization': 'Bearer ' + token }     
    })
  }

  async update(dto: DTO.UserUpdateDTO, token: string): Promise<void> {
    await Axios.put<DTO.UserUpdateResponseDTO>(
      ApiService.apiUrl + this.endpoints.put,
      dto,
      { headers: { 'Authorization': 'Bearer ' + token } });
  }

  async delete(user: CurrentUser): Promise<void> {

  }
}