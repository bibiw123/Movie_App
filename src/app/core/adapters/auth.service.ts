import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Credentials } from '../models/user.model';
import { AlertService } from '../../shared/services/alert.service';
import { Router } from '@angular/router';
import { UserGateway } from '../ports/user.gateway';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthGateway {

  apiurl = environment.API_URL
  constructor(
    private http: HttpClient,
    private userService: UserGateway,
    private alert: AlertService,
    private router: Router
  ) { }

  /* STORE isAuth : BehaviorSubject _isAuth$ */
  private _isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuth$: Observable<boolean> = this._isAuth$.asObservable()

  /**
   * role: créer un nouveau user
   * @param user 
   * @returns 
   */
  register(user: any): Observable<any> {
    const endpoint = "/register"
    return this.http.post(this.apiurl + endpoint, user)
  }

  /**
   * role: login le user
   * @param user 
   * @returns 
   */
  login(user: Credentials): Observable<any> {
    const endpoint = "/login";
    return this.http.post(this.apiurl + endpoint, user)
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

  /**
   * role: logout le user
   * @returns 
   */
  logout(): Observable<any> {
    const endpoint = "/logout"
    this.userService.resetUserData()
    this._isAuth$.next(false)
    localStorage.removeItem("token");
    this.alert.show('Vous êtes déconnecté(e)', 'success')
    this.router.navigate([''])
    return this.http.get(this.apiurl + endpoint)
  }

  /**
   * role: stocker le token dans le localStorage
   * @param token 
   */
  storeTokenInLocalStorage(token: string): void {
    localStorage.setItem("token", token)
  }

  /**
   * role: récupérer le token du localStorage
   * @returns 
   */
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem("token")
  }
}
