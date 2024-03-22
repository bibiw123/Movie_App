import { BehaviorSubject, Observable } from "rxjs";
import { UserModel } from "../models/user.model";

export abstract class UserGateway {

  public abstract user$ : Observable<UserModel | null>

  abstract addMovieToWatchlist(movie: any): Observable<any>;
  abstract removeMovieToWatchlist(movie: any): Observable<any>;


}
