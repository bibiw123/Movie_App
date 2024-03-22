import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { Observable, Subject, forkJoin, of, switchMap } from 'rxjs';
import { SimpleUser, UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../models/movie.model';
import { TvShowModel } from '../models/tv-show.model';
import { moviesData } from '../data/movies.data';
import { tvShowsData } from '../data/tvshows.data';

@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  fakeMoviesWatchlist: MovieModel[] = moviesData;
  fakeSeriesWatchlist: TvShowModel[] = tvShowsData;

  constructor(private http: HttpClient) { }

  apiurl = environment.API_URL;

  private _user$: Subject<UserModel> = new Subject()
  public user$: Observable<UserModel> = this._user$.asObservable();

  /**
   * createUserModelAfterLogin
   *
   * Role: 
   * - construire un user:UserModel {username, email, watchList}
   * - pousser cette donnée avec this._user$.next(user)
   * 
   * Tous les compoments peuvent alors consommer user$
   * afin d'afficher les données utilisateur dans les vues HTML
   */
  createUserModelAfterLogin(user: SimpleUser): void {
    let userLoggedIn!: UserModel;
    // let userWatchList$ = of(user).pipe(
    //   switchMap((user) => {
    //     return forkJoin([
    //       this.fetchWatchlistMovies(),
    //       this.fetchWatchlistSeries()
    //     ]
    //     );
    //   })
    // )
    // userWatchList$.subscribe(response => {
    //   console.log('WatchList movies', response[0]);
    //   console.log('WatchList series', response[1]);
    //   userLoggedIn = new UserModel(user, response[0], response[1]);
    //   this._user$.next(userLoggedIn);
    // })
    userLoggedIn = new UserModel(user, this.fakeMoviesWatchlist, this.fakeSeriesWatchlist);
    this._user$.next(userLoggedIn);
  }


  fetchWatchlistMovies(): Observable<any> {
    return this.http.get('/movies')
  }

  fetchWatchlistSeries(): Observable<any> {
    return this.http.get('/series')
  }

  addMovieToWatchlist(movie: any): Observable<any> {
    const endpoint = '/movies';
    return this.http.post(this.apiurl + endpoint, movie)
  }

  removeMovieToWatchlist(movieId: number): Observable<any> {
    const endpoint = '/movies';
    return this.http.delete(`${this.apiurl}/${endpoint}/${movieId}`);
  }
}
