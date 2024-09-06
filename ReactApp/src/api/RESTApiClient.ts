import Axios from 'axios';
import { EndpointsMap } from "./EndpointsMap";
import IDataTransferObject from './IDataTransferObject';

export default abstract class GeneralPorpouseRESTClient<T extends IDataTransferObject> {
  abstract hostIp: string
  abstract endpoints: EndpointsMap
  public errorMessage: string | undefined = undefined
  
  private axiosCli = Axios.create({
    headers: {
      "Content-type": 'multipart/form-data'      
    }
  })

  async getAll(): Promise<T[]> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const response = await this.axiosCli.get<T[]>(targetUrl)
    return response.data
  }

  async get(id: number): Promise<T> {
    const targetUrl: string = this.hostIp + this.endpoints.get
    const urlParameters: string = `id=${id}`
    const response = await this.axiosCli.get<T>(targetUrl + urlParameters)    
    return response.data
  }
  
  async create(object: T): Promise<any> {
    const targetUrl: string = this.hostIp + this.endpoints.post
    const response = await this.axiosCli.post(targetUrl, { params: object.toCreateDTO() })    
    return response.data
  }

  async update(object: T): Promise<any> {    
    const targetUrl: string = this.hostIp + this.endpoints.put
    const response = await this.axiosCli.put(targetUrl, { params: object.toUpdateDTO() })
    return response.data
  }

  async delete(id: number): Promise<void> {
    this.axiosCli.delete<T>(this.endpoints.delete + `id=${id}`);    
  }
}