import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieModel, MovieModelMapper } from '../models/movie.model';
import { TvShowModel } from '../models/series.model';
import { SearchModel } from '../models/search.model';
import { TMDBGateway } from '../ports/tmdb.gateway';


@Injectable({
  providedIn: 'root'
})
export class TMDBService implements TMDBGateway {

  moviesPageNumber = 1;

  private TMDB_URL: string = environment.TMDB_API_URL;

  /* STORE movies : BehaviorSubject _movies$ */
  private _movies$ = new BehaviorSubject<MovieModel[]>([]);
  public movies$: Observable<MovieModel[]> = this._movies$.asObservable();

  /* STORE series : BehaviorSubject _tv$ */
  private _tv$ = new BehaviorSubject<TvShowModel[]>([]);
  public tv$ = this._tv$.asObservable();

  /* STORE searchResults : BehaviorSubject _searchResults */
  private _searchResults$ = new BehaviorSubject<SearchModel[]>([]);
  public searchResults$ = this._searchResults$.asObservable();


  constructor(private http: HttpClient) { }
  /*
    Comment MAPPER les réponses API 
    dans notre modèle de données Frontend ?
    
    Observable.pipe( operator ) 
    > accepte en parametres un/des opérateur(s) de transformation
      ex: map(), filter(), etc....
    > return un Observable

    Ainsi on délégue au service la responsabilité de mapper les
    reponses API en modeles d'objets côté front-end
  */

  /**
   * API TMDB
   * endpoint : /discover/movie
   * @returns @Observable<MovieModel>
   */
  getMoviesFromApi(): Observable<MovieModel[]> {
    if (this._movies$.getValue().length === 0) {
      const ENDPOINT = `/discover/movie`;
      let options = {
        params: { language: 'fr' }
      }
      this.http.get(this.TMDB_URL + ENDPOINT, options)
        .pipe(
          map((response: any) => response.results
            .slice(0, 12)
            .map(
              (movieFromApi: any) => MovieModelMapper.mapFromTmdb(movieFromApi)
            )
          )
        )
        .subscribe((response: MovieModel[]) => this._movies$.next(response))
    }
    return this._movies$.asObservable();
  }


  getPrevMoviesFromApi(): Observable<MovieModel[]> {
    this.moviesPageNumber--;
    const ENDPOINT = `/discover/movie`;
    let options = {
      params: { language: 'fr', page: this.moviesPageNumber }
    }
    this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map((response: any) =>
          response.results.map(
            (movieFromApi: any) => MovieModelMapper.mapFromTmdb(movieFromApi)
          )
        )
      )
      //fairela request HTTP
      .subscribe((response: MovieModel[]) => {
        //let movies = this.movies$$.getValue();
        let newMovies = [...response];
        this._movies$.next(newMovies);
      })

    return this._movies$.asObservable()
  }


  getNextMoviesFromApi(pageNumber?: number): Observable<MovieModel[]> {
    if (!pageNumber) {
      this.moviesPageNumber++;
    }
    else {
      this.moviesPageNumber = pageNumber;
    }
    const ENDPOINT = `/discover/movie`;
    let options = {
      params: { language: 'fr', page: this.moviesPageNumber }
    }
    this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map((response: any) =>
          response.results.map(
            (movieFromApi: any) => MovieModelMapper.mapFromTmdb(movieFromApi)
          )
        )
      )
      //fairela request HTTP
      .subscribe((response: MovieModel[]) => {
        //let movies = this.movies$$.getValue();
        let newMovies = [...response];
        this._movies$.next(newMovies);
      })

    return this._movies$.asObservable()


  }

  /**
   * API TMDB
   * endpoint : /discover/tv
   * @returns @Observable<TvShowModel[]>
   */
  getTvShowFromApi(): Observable<TvShowModel[]> {
    if (this._tv$.getValue().length > 0) {
      return this._tv$.asObservable()
    }
    else {
      const ENDPOINT = `/discover/tv`;
      let options = {
        params: { language: 'fr' }
      }
      this.http.get(this.TMDB_URL + ENDPOINT, options)
        .pipe(
          map((response: any) =>
            response.results
              .slice(0, 6)
              .map(
                (tvshowFromApi: any) => new TvShowModel(tvshowFromApi)
              )
            //.filter((tvShow: TvShowModel) => tvShow.resume.length)
          )
        )
        .subscribe(response => this._tv$.next(response))
      return this._tv$.asObservable()
    }
  }

  /**
  * API TMDB
  * endpoint: /tv/{id}
  * queryParam: append_to_response=videos
  * @returns @Observable<TvShowModel>
  * // https://api.themoviedb.org/3/tv/{series_id}/credits
  */
  getOneTvShowFromApi(id: string): Observable<TvShowModel> {
    const ENDPOINT = `/tv/${id}`;
    let options = {
      params: {
        language: 'fr',
        append_to_response: 'videos'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(response => new TvShowModel(response))
      )
  }



  /**
   * API TMDB
   * endpoint: /movie/{id}
   * queryParam: append_to_response=videos
   * @returns @Observable<MovieModel>
   */
  getMovieFromApi(id: string): Observable<MovieModel> {
    const ENDPOINT = `/movie/${id}`;
    let options = {
      params: {
        language: 'fr',
        append_to_response: 'videos'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(response => MovieModelMapper.mapFromTmdb(response))
      );
  }

  /**
   * API TMDB
   * endpoint /search/multi
   * queryParams userSearchText : string
   * @returns Observable<any> (movies, tvshows, or people)
   */
  search(userSearchText: string): Observable<any> {
    let ENDPOINT = '/search/multi';
    let options = {
      params: {
        language: 'fr',
        query: userSearchText
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(
          (response: any) => response.results.map((item: any) => new SearchModel(item))
        )
      )

  }



}
