import { Observable } from "rxjs";
import { MovieModel } from "../models/movie.model";
import { TvShowModel } from "../models/serie.model";
import { SearchModel } from "../models/search.model";

/*
    Dans le cadre de l'architecture port/adapter (clean architecture)
    Le service TMDBService implémente cette classe APIExternalMoviesGateway
                                      
    Le principe :          PORT       *            ADAPTER 1
    |COMPONENT| =====>   |Gateway|    *  =====>  |TMDBService|
      invoque         (abstractClass) *          (Service Concret implements Gateway)
                                      *
       A P P L I C A T I O N          *          OU ADAPTER 2
                                      *  =====>  |OtherService|
                                      *          (Service Concret implements Gateway)
                                      *
                                      *          OU ADAPTER 3
                                      *  =====>  |OtherService|
                                      *          (Service Concret implements Gateway)
                                      *

*/
export abstract class TMDBGateway {

    abstract movies$: Observable<MovieModel[]>;
    abstract tv$: Observable<TvShowModel[]>;
    abstract searchResults$: Observable<SearchModel[]>;
    // movies
    abstract getMoviesFromApi(genre?: number): Observable<MovieModel[]>;
    abstract getNextMoviesFromApi(pageNumber?: number): Observable<MovieModel[]>
    abstract getMovieFromApi(id: string): Observable<MovieModel>
    // series
    abstract getTvShowFromApi(genre?: number): Observable<TvShowModel[]>;
    abstract getNextTvShowFromApi(): Observable<TvShowModel[]>;
    abstract getOneTvShowFromApi(id: number): Observable<TvShowModel>;
    abstract getEpisodesFromApi(serieId: number, seasonNumber: number): Observable<any>;
    // search
    abstract search(userSearchText: string): Observable<any>
    // genres
    abstract movieGenreSelected: number;
    abstract seriesGenreSelected: number;

}
