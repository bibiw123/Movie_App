import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

  login(user: Credentials): Observable<any> {
    const endpoint = "/login";
    return this.http.post(this.apiurl + endpoint, user)
      .pipe(
        tap((response: any) => {
          this.storeTokenInLocalStorage(response.token);
          this._isAuth$.next(true);
          this.userService.createUserModelAfterLogin(response.user);
        })
      );
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
