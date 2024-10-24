import Axios from 'axios'

export type Endpoints = {
    get: string,
    post: string,
    put: string,
    delete: string,
}

export default class ApiService {
  public static apiUrl: string = 'http://52.45.165.140/';

  endpoints: Endpoints;
  bearerToken?: string = '';
  headers?: {} = undefined;

  constructor(endpoints: Endpoints, bearerToken?: string) {
    this.endpoints = endpoints;
    this.bearerToken = bearerToken;
    if (bearerToken)
      this.headers = {...this.headers, 'Authorization': 'Bearer ' + this.bearerToken }
  }

  async getAll<DTO>(): Promise<DTO[]> {
    return (await Axios.get<DTO[]>(
      ApiService.apiUrl + this.endpoints.get,
      { headers: this.headers }
    )).data;
  }

  async get<DTO>(id: number): Promise<DTO> {
    return (await Axios.get<DTO>(
      `${ApiService.apiUrl + this.endpoints.get}?id=${id}`,
      { headers: this.headers }
    )).data;
  }

  async post<DTO, ResponseDTO>(data: DTO): Promise<ResponseDTO> {
    return (await Axios.post<ResponseDTO>(
      ApiService.apiUrl + this.endpoints.post,
      data,
      { headers: this.headers }
    )).data;
  }

  async put<DTO, ResponseDTO>(data: DTO): Promise<ResponseDTO> {
    return (await Axios.put(
      ApiService.apiUrl + this.endpoints.put, 
      data,
      { headers: this.headers }
    )).data;
  }

  async delete<DTO, ResponseDTO>(data: DTO): Promise<ResponseDTO> {
    return (await Axios.delete<ResponseDTO>(
      ApiService.apiUrl + this.endpoints.delete, 
      { headers: this.headers, data: data }
    )).data;
  }
}