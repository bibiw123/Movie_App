import { BehaviorSubject, Observable } from "rxjs";
import { SimpleUser, UserModel } from "../models/user.model";

export abstract class UserGateway {

  public abstract user$: Observable<UserModel>
  abstract createUserModelAfterLogin(user: SimpleUser): void

  abstract fetchWatchlistMovies(): Observable<any>
  abstract fetchWatchlistSeries(): Observable<any>

  abstract addMovieToWatchlist(movie: any): Observable<any>;
  abstract removeMovieToWatchlist(movie: any): Observable<any>;

}
