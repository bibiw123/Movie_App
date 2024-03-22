import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { Observable, Subject } from 'rxjs';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  apiurl = environment.API_URL;

  private _user$: Subject<UserModel> = new Subject()
  public user$: Observable<UserModel> = this._user$.asObservable();

  // user:UserModel = {
  //   username:'',
  //   email:'',
  //   watchList: {
  //     movies: [],
  //     series: []
  //   }
  // }

  constructor(private http: HttpClient) { }

  addMovieToWatchlist(movie: any): Observable<any> {
    const endpoint = '/movies';
    return this.http.post(this.apiurl + endpoint, movie)
  }

  removeMovieToWatchlist(movieId: number): Observable<any> {
    const endpoint = '/movies';
    return this.http.delete(`${this.apiurl}/${endpoint}/${movieId}`);
  }
}
