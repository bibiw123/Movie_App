import { Observable } from "rxjs";
import { SimpleUser, UserModel } from "../models/user.model";
import { MovieModel } from "../models/movie.model";
import { MovieResponseDTO } from "../dto/postmovie.dto";
import { TvShowModel } from "../models/serie.model";

export abstract class UserGateway {

  abstract user$: Observable<any>
  abstract setUser$(user: UserModel | null): void
  abstract createUserModelAfterLogin(user: SimpleUser): Observable<UserModel | undefined>
  abstract getUser(): UserModel | undefined

  abstract fetchWatchlistMovies(): Observable<MovieModel[]>
  abstract fetchWatchlistSeries(): Observable<any>

  abstract postMovie(movie: MovieModel): void;
  abstract deleteMovie(movieId: number): void;
  abstract PostMovieStatusChange(movie: MovieModel, status: 0 | 1 | 2 | 3): Observable<any>;

  abstract postSerie(serie: TvShowModel): Observable<TvShowModel>;
  abstract deleteSerie(serie: any): void;

  abstract postEpisodes(serie: TvShowModel, episodes: any, tmdbSeasonId: number, status: number): Observable<any>;

  abstract isMovieInWatchlist(movie: MovieModel): boolean
  abstract isSerieInWatchlist(serie: TvShowModel): boolean
  abstract resetUserData(): void

}
