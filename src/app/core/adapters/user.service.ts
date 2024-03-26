import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, Subject, forkJoin, map, of, switchMap } from 'rxjs';
import { SimpleUser, UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../models/movie.model';
import { TvShowModel } from '../models/series.model';
import { MovieDTOMapper, MovieResponseDTO, PostMovieDTO } from '../dto/postmovie.dto';
import { AlertService } from '../../shared/services/alert.service';


@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  constructor(private http: HttpClient, private alert: AlertService) { }
  apiurl = environment.API_URL;

  /* STORE user : BehaviorSubject _user$ */
  private _user$: BehaviorSubject<Partial<UserModel>> = new BehaviorSubject({})
  public user$: Observable<any> = this._user$.asObservable();

  /**
   * createUserModelAfterLogin()
   * Role: construire un user:UserModel {username, email, watchList, reviews}
   *       et pousser cette donnée dans le STORE, this._user$.next(user)
   *
   * Les compoments peuvent alors consommer "user$ | async"
   * afin d'afficher les données utilisateur dans les vues HTML
   */
  createUserModelAfterLogin(user: SimpleUser): void {
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
  }

  getUser(): UserModel{
    return this._user$.getValue() as UserModel
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
      )
      )
  }

  /**
   * endpoint: [POST] /movies
   * Role: poster un movie dans la watchlist du user
   * @returns Observable<MovieModel[]>
   */
  postMovie(movie: MovieModel): void {
    const endpoint = '/movies';
    const movieDto: PostMovieDTO = MovieDTOMapper.mapFromMovieModel(movie)
    this.http.post(this.apiurl + endpoint, movieDto).subscribe(
      (apiResponse : any) => {
        let user: UserModel | Partial<UserModel> = this._user$.getValue();
        if (user.watchList) {
          movie.api_id = apiResponse.id
          user.watchList.movies = [movie, ...user.watchList.movies]
          console.log( user);
          this._user$.next(user)
          this.alert.show('Film ajouté à la watchlist', 'success')
        }
      }
    )
  }

  /**
   * endpoint: [DELETE] /movies/:id
   * Role: supprimer un movie de la watchlist du user
   * @param movieId
   */
  deleteMovie(movieId: number): void {
    const endpoint = `/movies/${movieId}`;
    // 1 faire la request HTTP delete, puis recuperer la response (movieid)
    // 2 le back-end a répondu, donc on delete le film dans "user.watchlist.movies" (avec .filter)
    // https://herewecode.io/fr/blog/supprimer-element-tableau-javascript/#:~:text=Si%20on%20souhaite%20supprimer%20le,rapidement%20avec%20la%20m%C3%A9thode%20shift.&text=On%20peut%20aussi%20utiliser%20la,d'une%20cha%C3%AEne%20de%20caract%C3%A8res.
    // 3 Déclencher le changement dans le store ._user$

    this.http.delete(this.apiurl + endpoint).subscribe(
      apiResponse => {
        let user: UserModel | Partial<UserModel> = this._user$.getValue();
        if (user.watchList) {
          user.watchList.movies = user.watchList.movies.filter(movie => movie.api_id !== movieId);
          this._user$.next(user);
          this.alert.show('Film supprimé de la watchlist', 'success');
        }
      },
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

  public setUser$(user: UserModel): void {
    this._user$.next(user)

  }

  resetUserData() {
    this._user$.next({})
  }

}
