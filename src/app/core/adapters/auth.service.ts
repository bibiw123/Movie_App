import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../shared/services/alert.service';
import { Router } from '@angular/router';
import { UserGateway } from '../ports/user.gateway';
import { UserRegisterDTO } from '../dto/user-register.dto';
import { UserCredentialsDTO, UserCredentialsResponseDTO } from '../dto/user-credentials.dto';
import { UserModel } from '../models/user.model';

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

  /**************************************** 
  * STORE isAuth : BehaviorSubject _isAuth$ 
  *****************************************/
  private _isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuth$: Observable<boolean> = this._isAuth$.asObservable()

  /**
   * role: créer un nouveau user
   * @param user UserRegisterDTO
   * @returns Observable<number>
   */
  register(user: UserRegisterDTO): Observable<number> {
    const endpoint = "/register"
    return this.http.post<number>(this.apiurl + endpoint, user)
  }

  /**
   * role: login le user
   * @param user UserCredentialsDTO
   * @returns Observable<UserCredentialsResponseDTO>
   */
  login(user: UserCredentialsDTO): Observable<UserCredentialsResponseDTO> {
    const endpoint = "/login";
    return this.http.post<UserCredentialsResponseDTO>(this.apiurl + endpoint, user)
      .pipe(
        tap((apiResponse: UserCredentialsResponseDTO) => {
          if (apiResponse.token && apiResponse.token.length) {
            this.storeTokenInLocalStorage(apiResponse.token);
            this._isAuth$.next(true);
            this.userService.createUserModelAfterLogin(apiResponse.user);
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
   * @returns token
   */
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem("token")
  }
}
