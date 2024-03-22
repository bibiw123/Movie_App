import { Observable } from "rxjs";
import { MovieModel } from "../models/movie.model";
import { TvShowModel } from "../models/tv-show.model";

/* 
    Dans le cadre de l'architecture port/adapter (clean architecture)
    Le service TMDBService implémente cette classe APIExternalMoviesGateway

    Le principe :          PORT                ADAPTER 1 
    |COMPONENT| =====>   |Gateway|  =====>  |TMDBService|                   
                      (abstractClass)       (Service Concret)

                                               ADAPTER 2 
                                    =====>  |OtherService|                   
                                            (Service Concret)
                                            
                                                ADAPTER 3 
                                    =====>  |OtherService|                   
                                            (Service Concret) 


*/
export abstract class APIExternalMoviesGateway {

    abstract movies$: Observable<MovieModel[]>;
    abstract tv$: Observable<TvShowModel[]>;
    abstract getMoviesFromApi(): Observable<MovieModel[]>;
    abstract getNextMoviesFromApi(pageNumber?: number): Observable<MovieModel[]>
    abstract getPrevMoviesFromApi(): Observable<MovieModel[]>
    abstract getMovieFromApi(id: string): Observable<MovieModel>
    abstract getTvShowFromApi(): Observable<TvShowModel[]>;
    abstract getOneTvShowFromApi(id: string): Observable<TvShowModel>;
    abstract search(userSearchText: string): Observable<any>

}
