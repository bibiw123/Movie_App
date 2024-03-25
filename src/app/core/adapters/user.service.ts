import { Injectable } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, Subject, forkJoin, map, of, switchMap } from 'rxjs';
import { SimpleUser, UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../models/movie.model';
import { TvShowModel } from '../models/series.model';
import { moviesData } from '../data/movies.data';
import { tvShowsData } from '../data/series.data';
import { MovieDTOMapper, MovieResponseDTO, PostMovieDTO } from '../dto/postmovie.dto';




@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  constructor(private http: HttpClient) { }

  apiurl = environment.API_URL;

  /* STORE user : BehaviorSubject _user$ */
  private _user$: BehaviorSubject<Partial<UserModel>> = new BehaviorSubject({})
  public user$: Observable<any> = this._user$.asObservable();

  /**
   * createUserModelAfterLogin
   * Role: 
   * - construire un user:UserModel {username, email, watchList}
   * - pousser cette donnée avec this._user$.next(user)
   * 
   * Tous les compoments peuvent alors consommer user$ | async
   * afin d'afficher les données utilisateur dans les vues HTML
   */
  createUserModelAfterLogin(user: SimpleUser): void {
    const userWatchList$ = of(user).pipe(
      switchMap((user) => {
        return forkJoin([
          this.fetchWatchlistMovies(),
          this.fetchWatchlistSeries()
        ]);
      })
    );
    userWatchList$
      .pipe(
        map(response => new UserModel(user, response[0], response[1]))
      )
      .subscribe((userLoggedIn: UserModel) => {
        this._user$.next(userLoggedIn);
      })
  }


  fetchWatchlistMovies(): Observable<any> {
    return this.http.get('/movies')
  }
  fetchWatchlistSeries(): Observable<any> {
    return this.http.get('/series')
  }




  postMovie(movie: MovieModel): void {
    const endpoint = '/movies';
    const movieDto: PostMovieDTO = MovieDTOMapper.mapFromMovieModel(movie)
    this.http.post(this.apiurl + endpoint, movieDto).subscribe(
      response => {
        // recupere le user dans le store _user$
        let user: UserModel | Partial<UserModel> = this._user$.getValue();
        if (user.watchList) {
          // user.watchList.movies.push(movie);
          user.watchList.movies = [movie, ...user.watchList.movies]
          this._user$.next(user)
        }
      }
    ) // fin du subscribe
  }

  deleteMovie(movieId: number): void {
    const endpoint = '/movies';
    this.http.delete(`${this.apiurl}/${endpoint}/${movieId}`)
    // 1 faire la request HTTP, puis recuperer la response (movieid)
    // 2 delete le film de user.watchlist.movies (avec filter)
    // https://herewecode.io/fr/blog/supprimer-element-tableau-javascript/#:~:text=Si%20on%20souhaite%20supprimer%20le,rapidement%20avec%20la%20m%C3%A9thode%20shift.&text=On%20peut%20aussi%20utiliser%20la,d'une%20cha%C3%AEne%20de%20caract%C3%A8res.
    // 3 Déclencher le changement dans le store ._user$
  }


  public setUser$(user: UserModel): void {
    this._user$.next(user)

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



  resetUserData() {
    this._user$.next({})
  }
}

