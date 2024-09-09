import Game from "./../models/Game";
import { EndpointsMap } from "./EndpointsMap";
import GeneralPorpouseRESTClient from "./RESTApiClient";

export default class GameApiClient extends GeneralPorpouseRESTClient<Game> {
  override endpoints: EndpointsMap = {
    get: 'api/roms/',
    post: 'api/roms/create/',
    put: 'api/roms/update/',
    delete: 'api/roms/delete/'
  }

  constructor() {
    super("http://localhost:8080/")
  }
}