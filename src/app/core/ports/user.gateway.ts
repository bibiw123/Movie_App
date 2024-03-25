import { Observable } from "rxjs";
import { SimpleUser, UserModel } from "../models/user.model";

export abstract class UserGateway {

  abstract user$: Observable<any>
  abstract setUser$(user: UserModel | null): void
  abstract createUserModelAfterLogin(user: SimpleUser): UserModel

  abstract fetchWatchlistMovies(): Observable<any>
  abstract fetchWatchlistSeries(): Observable<any>

  abstract postMovie(movie: any): void;
  abstract deleteMovie(movie: any): Observable<any>;

}
