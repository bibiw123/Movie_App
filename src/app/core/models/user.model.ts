import { MovieModel } from "./movie.model";
import { TvShowModel } from "./series.model";

// type WatchList
export class WatchList {
    movies: MovieModel[]
    series: TvShowModel[]
    constructor(movies: MovieModel[], series: TvShowModel[]) {
        this.movies = movies;
        this.series = series
    }
}

// type UserModel
export class UserModel {
    username: string;
    email: string;
    watchList: WatchList

    constructor(user: any, movies: MovieModel[], series: TvShowModel[]) {
        this.username = user.username;
        this.email = user.email;
        this.watchList = new WatchList(movies, series)
    }
}

// type SimpleUser
export type SimpleUser = Pick<UserModel, 'username' | 'email'>

// type Credentials
export type Credentials = {
    email: string,
    password: string
}
