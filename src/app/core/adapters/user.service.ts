import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, Subject, forkJoin, map, of, switchMap } from 'rxjs';
import { SimpleUser, UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../models/movie.model';
import { MovieDTOMapper, MovieResponseDTO, PostMovieDTO } from '../dto/postmovie.dto';
import { AlertService } from '../../shared/services/alert.service';


@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  constructor(private http: HttpClient, private alert: AlertService) { }
  apiurl = environment.API_URL;

  /************************************
   * STORE user: BehaviorSubject _user$ 
  ************************************/
  private _user$ = new BehaviorSubject<UserModel | undefined>(undefined);
  public user$: Observable<UserModel | undefined> = this._user$.asObservable();


  /**
   * createUserModelAfterLogin()
   * Role: construire un user:UserModel {username, email, watchList, reviews}
   *       et pousser cette donnée dans le STORE, this._user$.next(user)
   *
   * Les components peuvent alors consommer "user$ | async"
   * afin d'afficher les données utilisateur dans les vues HTML
  */
  createUserModelAfterLogin(user: SimpleUser): Observable<UserModel | undefined> {
    const userWatchList$ = of(user).pipe(
      switchMap((user) => {
        return forkJoin([
          this.fetchWatchlistMovies(),
          //this.fetchWatchlistSeries()
          of([])
        ]);
      })
    );
    userWatchList$
      .pipe(
        map(apiResponse => new UserModel(user, apiResponse[0], apiResponse[1]))
      )
      .subscribe((userLoggedIn: UserModel) => {
        console.log('created user after login:', userLoggedIn)
        this._user$.next(userLoggedIn);
      })
    return this._user$.asObservable()
  }

  /**
   * getUser()
   * Role: getter pour récupérer le user dans le STORE
   * @returns UserModel
  */
  getUser(): UserModel {
    return this._user$.getValue() as UserModel
  }

  /**
   * role : set user in the store
   * @param user UserModel
  */
  public setUser$(user: UserModel): void {
    this._user$.next(user)
  }

  /**
    * role : reset user in the store
    * @param user UserModel
  */
  resetUserData() {
    this._user$.next(undefined)
  }

  /**** WATCHLIST MOVIES ****/

  /**
   * endpoint: [GET] /movies
   * Role: récupérer la liste movies watchlist du user
   * @returns Observable<MovieModel[]>
   */
  fetchWatchlistMovies(): Observable<MovieModel[]> {
    const endpoint = '/movies'
    return this.http.get(this.apiurl + endpoint)
      .pipe(map((apiResponse: any) =>
        apiResponse.map(
          (movie: MovieResponseDTO) => MovieDTOMapper.mapToMovieModel(movie)
        )
      ))
  }

  /**
   * endpoint: [POST] /movies
   * Role: poster un movie dans la watchlist du user
   * @param movie MovieModel
   */
  postMovie(movie: MovieModel): void {
    const endpoint = '/movies';
    const movieDto: PostMovieDTO = MovieDTOMapper.mapFromMovieModel(movie)
    this.http.post(this.apiurl + endpoint, movieDto).subscribe(
      (apiResponse: any) => {
        let user: UserModel | undefined = this._user$.getValue();
        if (user?.watchList) {
          movie.api_id = apiResponse.id
          user.watchList.movies = [movie, ...user.watchList.movies]
          this._user$.next(user)
          this.alert.show('Film ajouté à la watchlist', 'success')
        }
      }
    )
  }

  /**
   * endpoint: [DELETE] /movies/:id
   * Role: supprimer un movie de la watchlist du user
   * @param movieId number
   */
  deleteMovie(movieId: number): void {
    const endpoint = `/movies/${movieId}`;
    this.http.delete(this.apiurl + endpoint).subscribe(
      apiResponse => {
        let user: UserModel | undefined = this._user$.getValue();
        if (user?.watchList) {
          user.watchList.movies = user.watchList.movies.filter(movie => movie.api_id !== movieId);
          this._user$.next(user);
          this.alert.show('Film supprimé de la watchlist', 'success');
        }
      }
    );
  }


  /**** WATCHLIST MOVIES ****/

  /**
   * endpoint: [GET] /series
   * Role: récupérer la liste series watchlist du user
   * @returns Observable<SerieModel[]>
   */
  fetchWatchlistSeries(): Observable<any> {
    const endpoint = '/series'
    return this.http.get(this.apiurl + endpoint)
  }





  /**
   * méthode utilitaire
   * isMovieInWatchlist
   * rôle: permet aux components de vérifier
   *       si un movie est dans la watchlist du user
   * @param movie
   * @returns boolean
   */
  isMovieInWatchlist(movie: MovieModel): boolean {
    let user = this._user$.getValue();
    if (user?.watchList?.movies) {
      return user.watchList?.movies.some(
        watchlistMovieItem => watchlistMovieItem.tmdb_id === movie.tmdb_id)
    }
    return false;
  }

}
