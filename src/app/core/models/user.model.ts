import { MovieModel } from "./movie.model";
import { TvShowModel } from "./tv-show.model";

export class WatchList  {
  movies:MovieModel[]
  series:TvShowModel[]
  constructor(movies:MovieModel[], series:TvShowModel[]) {
    this.movies = movies;
    this.series = series
  }
}

export class UserModel {
    username: string;
    email:string;
    watchList: WatchList

    constructor(user:any, movies:MovieModel[], series:TvShowModel[]) {
      this.username = user.username;
      this.email = user.email;
      this.watchList = new WatchList(movies, series)
    }
}
