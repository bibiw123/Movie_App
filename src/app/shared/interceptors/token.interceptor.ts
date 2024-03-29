import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Utils } from '../utils/utils';
import { AuthGateway } from '../../core/ports/auth.gateway';

interface Endpoint {
  endpoint: string,
  method: 'ALL' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  // list of endpoints need a user token
  private apiAuthEndpoints: Endpoint[] = [
    { endpoint: '/watchlist', method: 'ALL' },
    { endpoint: '/reviews', method: 'POST' },
    { endpoint: '/movies', method: 'ALL' },
    { endpoint: '/series', method: 'ALL' },
    { endpoint: '/episodes', method: 'ALL' },
    // add other...
  ];
  TMDB_URL = environment.TMDB_API_URL;
  TMDB_TOKEN = environment.TMDB_TOKEN;
  MYAPI_URL = environment.API_URL;

  constructor(private _authSvc: AuthGateway) { }

  /**
   * le rôle de intercept est d'intercepter req (HttpRequest Object)
   * afin dajouter un nom un token (on the fly) selon :
   * l'API appelée, le endpoint et la méthode
  */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('token interceptor', req);
    let cloneRequest: HttpRequest<any> = req;

    // SI API TMDB
    if (req.url.includes(this.TMDB_URL)) {
      cloneRequest = this.addBearerToken(req, this.TMDB_TOKEN);
    }

    // SI notre API et SI l'url necessite l'authentification
    console.log(this.isUrlNeedsUserToken(req));
    if (this.isUrlNeedsUserToken(req)) {
      const token = this._authSvc.getTokenFromLocalStorage();
      if (token !== null)
        cloneRequest = this.addBearerToken(req, token);
    }

    return next.handle(cloneRequest);
  }




  /**
    * Check if
    * url called is my api
    * url needs user token or not
    * @param request:HttpRequest
    * @returns boolean
  */
  private isUrlNeedsUserToken(request: HttpRequest<any>): boolean {
    if (request.url.includes(this.MYAPI_URL)) {
      let endpoint = Utils.getUrlEndpoint(this.MYAPI_URL, request.url);
      // verify if the request exists in endPoint[] we defined
      let requestIsAnAuthEnpoint = this.apiAuthEndpoints.find(item =>
        endpoint.includes(item.endpoint) &&
        (item.method === request.method || item.method === 'ALL')
      );
      console.log('requestIsAnAuthEnpoint:', requestIsAnAuthEnpoint);
      if (requestIsAnAuthEnpoint) {
        return true;
      }
    }
    return false;
  }


  /**
   * addBearerToken
   * @param request
   * @param token
   * @returns req:HttpRequest
   */
  private addBearerToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers
        .append('Authorization', `Bearer ${token}`)
        .append('accept', 'application/json'),
    })
  }

}
