import Game from "./../models/Game";
import { EndpointsMap } from "./EndpointsMap";
import GeneralPorpouseRESTClient from "./RESTApiClient";

export default class GameApiClient extends GeneralPorpouseRESTClient<Game> {
  override hostIp: string = "http://localhost:8080/";
  override endpoints: EndpointsMap = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  }
}