import { Observable } from "rxjs";
import { MovieModel } from "../models/movie.model";
import { TvShowModel } from "../models/serie.model";
import { SearchModel } from "../models/search.model";

/*
    Dans le cadre de l'architecture port/adapter (clean architecture)
    Le service TMDBService implémente cette classe APIExternalMoviesGateway

    Le principe :          PORT                ADAPTER 1
    |COMPONENT| =====>   |Gateway|  =====>  |TMDBService|
                      (abstractClass)       (Service Concret)

                                              OU ADAPTER 2
                                    =====>  |OtherService|
                                            (Service Concret)

                                              OU ADAPTER 3
                                    =====>  |OtherService|
                                            (Service Concret)


*/
export abstract class TMDBGateway {

    abstract movies$: Observable<MovieModel[]>;
    abstract tv$: Observable<TvShowModel[]>;
    abstract searchResults$: Observable<SearchModel[]>;
    // movies
    abstract getMoviesFromApi(): Observable<MovieModel[]>;
    abstract getNextMoviesFromApi(pageNumber?: number): Observable<MovieModel[]>
    abstract getMovieFromApi(id: string): Observable<MovieModel>
    // series
    abstract getTvShowFromApi(): Observable<TvShowModel[]>;
    abstract getNextTvShowFromApi(): Observable<TvShowModel[]>;
    abstract getOneTvShowFromApi(id: string): Observable<TvShowModel>;
    abstract getEpisodesFromApi(serieId: number, seasonNumber: number): any;
    // search
    abstract search(userSearchText: string): Observable<any>

}
