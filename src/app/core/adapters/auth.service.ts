import { Injectable } from '@angular/core';
import { AuthGateway } from '../ports/auth.gateway';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../shared/services/alert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthGateway {

  apiurl = environment.API_URL

  constructor(private http: HttpClient, private alert:AlertService, private router:Router) { }


  private _isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuth$: Observable<boolean> = this._isAuth$.asObservable()

   register(user:any): Observable<any> {
    const endpoint = "/register"
    return this.http.post(this.apiurl+endpoint,user)
  }

  login(user: any): void{
    const endpoint = "/login"
    this.http.post(this.apiurl + endpoint, user)
    .subscribe((response:any) =>{
      console.log(response);
      this.storeTokenInLocalStorage(response.token);
      this._isAuth$.next(true)
      this.alert.show("Vous êtes bien connecté(e)");
      this.router.navigate([''])
    } )
  }

  logout(): Observable<any> {
    const endpoint = "/logout"
    this._isAuth$.next(false)
    return this.http.get(this.apiurl + endpoint)
  }

  storeTokenInLocalStorage(token:string): void {
    localStorage.setItem("token",token)

  }
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem("token")
  }
}
