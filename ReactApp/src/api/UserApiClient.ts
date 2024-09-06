import { EndpointsMap } from "./EndpointsMap";

export default class UserApiClient {
  hostIp: string = "http://localhost:8080/";
  endpoints: EndpointsMap = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  }
}