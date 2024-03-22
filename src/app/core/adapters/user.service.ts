import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  constructor() { }
  private _user$: BehaviorSubject<UserModel | null> = new BehaviorSubject(null)
  public user$: Observable<any> = this._user$.asObservable();

  // user:UserModel = {
  //   username:'',
  //   email:'',
  //   watchList: {
  //     movies: [],
  //     series: []
  //   }
  // }

  addMovieToWatchlist(movie: any): Observable<any> {

  }

  removeMovieToWatchlist(movie: any): Observable<any> {

  }
}
