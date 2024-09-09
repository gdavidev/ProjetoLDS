import Axios from 'axios';
import { EndpointsMap } from "./EndpointsMap";
import IDataTransferObject from './IDataTransferObject';

export default abstract class GeneralPorpouseRESTClient<T extends IDataTransferObject> {
  protected abstract endpoints: EndpointsMap
  public errorMessage?: string = undefined  
  private hostIp: string
  private bearerToken?: string = undefined

  constructor(hostIp: string) {
    this.hostIp = hostIp
  }

  async getAll<DtoType>(): Promise<DtoType[]> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const response = await Axios.get<DtoType[]>(targetUrl)    
    return response.data
  }

  async get<DtoType>(id: number): Promise<DtoType> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const urlParameters: string = `id=${id}`
    const response = await Axios.get<DtoType>(targetUrl + urlParameters)
    return response.data
  }
  
  async create(object: T): Promise<any> {    
    const targetUrl: string = this.hostIp + this.endpoints.post
    const response = await Axios({
        method: 'post',
        url: targetUrl,
        headers: { 
          'Authorization': this.bearerToken ? 'Bearer ' + this.bearerToken : '',
          'Content-Type': 'multipart/form-data'
        },      
        data: object.toCreateDTO(),
      })    
    return response.data
  }

  async update(object: T): Promise<any> {    
    const targetUrl: string = this.hostIp + this.endpoints.put
    const response = await Axios.put(
      targetUrl,
      object.toUpdateDTO(),
      { headers: { 
        'Authorization': this.bearerToken ? 'Bearer ' + this.bearerToken : '',
        'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    Axios.delete<T>(this.endpoints.delete + `id=${id}`);    
  }

  setBearerToken(bearerToken: string) {
    this.bearerToken = bearerToken
  }
}