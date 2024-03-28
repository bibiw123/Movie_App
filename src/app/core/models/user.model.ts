import { MovieModel } from "./movie.model";
import { TvShowModel } from "./serie.model";

// type WatchList
export class WatchList {
    movies: MovieModel[]
    series: TvShowModel[]
    constructor(movies: MovieModel[], series: TvShowModel[]) {
        this.movies = movies;
        this.series = series
    }
}

/**
 * UserModel
 * Role: représente un utilisateur dans l'application
 * Cette donnée est très importante car elle est utilisée dans plusieurs composants
 * exemple : user.watchList.movies pour afficher la liste des films du user
 *           user.watchList.series pour afficher la liste des series du user
 *           user.username pour afficher le nom du user
 * @param user
*/
export class UserModel {
    username: string;
    email: string;
    watchList: WatchList

    constructor(user: SimpleUser) {
        this.username = user.username;
        this.email = user.email;
        this.watchList = new WatchList([], [])
    }
    setWatchListMovies(movies: MovieModel[]): UserModel {
        this.watchList.movies = movies
        return this
    }
    setWatchListSeries(series: TvShowModel[]): UserModel {
        this.watchList.series = series;
        return this
    }
}

// type SimpleUser
export type SimpleUser = Pick<UserModel, 'username' | 'email'>
