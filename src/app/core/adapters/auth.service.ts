import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthGateway{

  apiurl=environment.API_URL

  constructor(private http:HttpClient) { }


  private _isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuth$: Observable<boolean>=this._isAuth$.asObservable()

   register(user:any): Observable<any> {
    const endpoint = "/api/v1/register"
    return this.http.post(this.apiurl+endpoint,user)
  }

   login(user:any): Observable<any> {
    const endpoint = "/login"
    return this.http.post(this.apiurl+endpoint,user)
  }

   logout(): Observable<any> {
    const endpoint = "/logout"
    return this.http.get(this.apiurl+endpoint)
  }
   storeTokenInLocalStorage(): void {

  }
   getTokenFromLocalStorage(): string {
    return ""
  }
}
