import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, Subject, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { SimpleUser, UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../models/movie.model';
import { MovieDTOMapper, MovieResponseDTO, PostMovieDTO } from '../dto/postmovie.dto';
import { AlertService } from '../../shared/services/alert.service';
import { TvShowModel } from '../models/serie.model';
import { PostSerieDTO, SerieDTOMapper } from '../dto/postserie.dto';


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
      switchMap((user: SimpleUser) => {
        return forkJoin([
          this.fetchWatchlistMovies(),
          this.fetchWatchlistSeries()
          //of([])
        ]);
      })
    );
    userWatchList$
      .pipe(
        map(apiResponse => {
          return new UserModel(user)
            .setWatchListMovies(apiResponse[0])
            .setWatchListSeries(apiResponse[1])
        })
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
          this.alert.show('Film ajouté à la watchlist')
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
      (apiResponse) => {
        let user: UserModel | undefined = this._user$.getValue();
        if (user?.watchList) {
          user.watchList.movies = user.watchList.movies.filter(movie => movie.api_id !== movieId);
          this._user$.next(user);
          this.alert.show('Film supprimé de la watchlist');
        }
      }
    );
  }

/**
   * endpoint: [POST] /series
   * Role: poster une série  dans la watchlist du user
   * @param serie TvShowModel
   */
  postSerie(serie: TvShowModel): void {
  const endpoint = '/series';
  const serieDTO: PostSerieDTO = SerieDTOMapper.mapFromSerieModel (serie)
  this.http.post(this.apiurl + endpoint, serieDTO).subscribe(
    (apiResponse: any) => {
      let user: UserModel | undefined = this._user$.getValue();
      if (user?.watchList) {
        serie.api_id = apiResponse.id
        user.watchList.series = [serie, ...user.watchList.series]
        this._user$.next(user)
        this.alert.show('Série ajoutée à la watchlist')
      }
    }
  )
}



  /**** WATCHLIST MOVIES ****/

  /**
   * endpoint: [GET] /series
   * Role: récupérer la liste series watchlist du user
   * @returns Observable<SerieModel[]>
   */
  fetchWatchlistSeries(): Observable<TvShowModel[]> {
    const endpoint = '/series'
    return this.http.get(this.apiurl + endpoint)
      .pipe(map((apiResponse: any) =>
        apiResponse.map(
          (movie: MovieResponseDTO) => MovieDTOMapper.mapToMovieModel(movie)
        )
      ))
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

  /**
   * méthode utilitaire
   * isSerieInWatchlist
   * rôle: permet aux components de vérifier
   *      si une série est dans la watchlist du user
   * @param serie
   * @returns boolean
   *
   */
  isSerieInWatchlist(serie: TvShowModel): boolean {
    let user = this._user$.getValue();
    if (user?.watchList?.series) {
      return user.watchList?.series.some(
        watchlistSerieItem => watchlistSerieItem.tmdb_id === serie.tmdb_id)
    }
    return false;
  }

}
