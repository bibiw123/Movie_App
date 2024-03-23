import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Credentials } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthGateway {

  apiurl = environment.API_URL

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }


  private _isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuth$: Observable<boolean> = this._isAuth$.asObservable()

  register(user: any): Observable<any> {
    const endpoint = "/register"
    return this.http.post(this.apiurl + endpoint, user)
  }

  /** loginUser
  *  endpoint /auth/login
  *  @param UserModel
  *  @returns Observable<any>
 */
  login(user: Credentials): Observable<any> {
    const endpoint = "/login";
    // return this.http.post(this.apiurl + endpoint, user)
    return of({
      token: "eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MTExMzQyOTAsImV4cCI6MTcxMTc2MDEwNywic3ViIjoiZnJlZG9AZ21haWwuY29tIiwiZW1haWwiOiJmcmVkb0BnbWFpbC5jb20ifQ.lKjV5_MbQGD7XBEVkeeAoTSQZQmx2fjMlECg5QA6QoFo2OeJ_CnvOc9FY09fm-3k",
      user: {
        username: "fredo",
        email: "fredo@gmail.com"
      }
    })
      .pipe(
        tap((response: any) => {
          if (response.token && response.token.length) {
            this.storeTokenInLocalStorage(response.token);
            this._isAuth$.next(true);
            this.userService.createUserModelAfterLogin(response.user);
          }
        })
      )
  }

  logout(): Observable<any> {
    const endpoint = "/logout"
    this._isAuth$.next(false)
    return this.http.get(this.apiurl + endpoint)
  }

  storeTokenInLocalStorage(token: string): void {
    localStorage.setItem("token", token)
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem("token")
  }
}
