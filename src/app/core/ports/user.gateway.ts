import { Observable } from "rxjs";
import { SimpleUser, UserModel } from "../models/user.model";
import { MovieModel } from "../models/movie.model";
import { MovieResponseDTO } from "../dto/postmovie.dto";
import { TvShowModel } from "../models/serie.model";

export abstract class UserGateway {

  abstract user$: Observable<any>
  abstract setUser$(user: UserModel | null): void
  abstract createUserModelAfterLogin(user: SimpleUser): Observable<UserModel | undefined>
  abstract getUser(): UserModel

  abstract fetchWatchlistMovies(): Observable<MovieModel[]>
  abstract fetchWatchlistSeries(): Observable<any>

  abstract postMovie(movie: MovieModel): void;
  abstract deleteMovie(movie: any): void;

  abstract postSerie(serie: TvShowModel): void;
  //abstract deleteSerie(serie: any): void;

  abstract isMovieInWatchlist(movie: MovieModel): boolean
  abstract isSerieInWatchlist(serie: TvShowModel): boolean
  abstract resetUserData(): void

}
