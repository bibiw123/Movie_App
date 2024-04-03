import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieModel, MovieModelMapper } from '../models/movie.model';
import { TvShowModel, TvShowModelMapper } from '../models/serie.model';
import { SearchModel } from '../models/search.model';
import { TMDBGateway } from '../ports/tmdb.gateway';



@Injectable({
  providedIn: 'root'
})
export class TMDBService implements TMDBGateway {

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

  // data
  moviesPageNumber = 1;
  seriesPageNumber = 1;
  movieGenreSelected: number = 0;
  seriesGenreSelected: number = 0;


  constructor(private http: HttpClient) { }

  /**
   * API TMDB
   * endpoint : /discover/movie
   * role : récupérer les films à découvrir
   * @returns @Observable<MovieModel>
   * @param genre number
   */
  getMoviesFromApi(genre?: number): Observable<MovieModel[]> {
    genre ? this.movieGenreSelected = genre : this.movieGenreSelected = -1;
    // si la liste est vide ou si un genre est sélectionné : faire la requête HTTP
    if (this._movies$.getValue().length === 0 || genre) {
      const ENDPOINT = `/discover/movie`;
      let options: any = { params: { language: 'fr' } }
      // ajouter un filtre genre si un genre est sélectionné
      if (genre && genre !== -1) options.params['with_genres'] = genre;
      this.http.get(this.TMDB_URL + ENDPOINT, options)
        .pipe(
          map((response: any) => response.results
            .map(
              (movieResponseFromApi: any) => MovieModelMapper.mapFromTmdb(movieResponseFromApi)
            )
          )
        )
        .subscribe((response: MovieModel[]) => this._movies$.next(response))
    }
    return this._movies$.asObservable();
  }

  /**
   * API TMDB
   * endpoint : /discover/movie
   * role : récupérer les films à découvrir de la page suivante
   * @param pageNumber optionnel
   * @returns @Observable<MovieModel>
   */
  getNextMoviesFromApi(pageNumber?: number): Observable<MovieModel[]> {
    !pageNumber
      ? this.moviesPageNumber++
      : this.moviesPageNumber = pageNumber;
    const ENDPOINT = `/discover/movie`;
    let options: any = { params: { language: 'fr', page: this.moviesPageNumber } }
    // ajouter un filtre genre si un genre est sélectionné
    if (this.movieGenreSelected !== 0)
      options.params['with_genres'] = this.movieGenreSelected;
    this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map((response: any) =>
          response.results.map(
            (movieFromApi: any) => MovieModelMapper.mapFromTmdb(movieFromApi)
          )
        )
      )
      .subscribe((newMovies: MovieModel[]) => {
        let allCurrentMovies = this._movies$.getValue();
        let allNewMovies = [...allCurrentMovies, ...newMovies];
        this._movies$.next(allNewMovies);
      })
    return this._movies$.asObservable()
  }


  /**
   * API TMDB
   * endpoint : /discover/tv
   * role : récupérer les séries à découvrir
   * @returns @Observable<TvShowModel[]>
   * @param genre number
   */
  getTvShowFromApi(genre?: number): Observable<TvShowModel[]> {
    genre ? this.movieGenreSelected = genre : this.movieGenreSelected = -1;
    // si la liste est vide ou si un genre est sélectionné : faire la requête HTTP
    if (this._tv$.getValue().length === 0 || genre) {
      const ENDPOINT = `/discover/tv`;
      let options: any = { params: { language: 'fr', page: this.seriesPageNumber } }
      // ajouter un filtre genre si un genre est sélectionné
      if (genre && genre !== -1) options.params['with_genres'] = genre;
      this.http.get(this.TMDB_URL + ENDPOINT, options)
        .pipe(
          map((response: any) =>
            response.results
              .map(
                (tvshowResponseFromApi: any) => {
                  return TvShowModelMapper.mapFromTmdb(tvshowResponseFromApi)
                })
          )
        )
        .subscribe((response: TvShowModel[]) => this._tv$.next(response))
    }
    return this._tv$.asObservable()
  }


  /**
   * API TMDB
   * endpoint : /discover/tv
   * role : récupérer les séries à découvrir de la page suivante
   * @param pageNumber optionnel
   * @returns @Observable<TvShowModel[]>
   */
  getNextTvShowFromApi(): Observable<TvShowModel[]> {
    this.seriesPageNumber++
    const ENDPOINT = `/discover/tv`;
    let options = { params: { language: 'fr', page: this.seriesPageNumber } }
    this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map((response: any) =>
          response.results
            .map(
              (tvshowResponseFromApi: any) => TvShowModelMapper.mapFromTmdb(tvshowResponseFromApi)
            )
        )
      )
      .subscribe((newTvShows: TvShowModel[]) => {
        let allCurrentSeries = this._tv$.getValue();
        let allNewSeries = [...allCurrentSeries, ...newTvShows];
        this._tv$.next(allNewSeries);
      })
    return this._tv$.asObservable()
  }


  /**
  * API TMDB
  * endpoint: /tv/{id}
  * role : récupérer une série
  * @param id number
  * queryParam: append_to_response=videos,credits
  * @returns @Observable<TvShowModel>
  */
  getOneTvShowFromApi(id: number): Observable<TvShowModel> {
    const ENDPOINT = `/tv/${id}`;
    let options = {
      params: {
        language: 'fr',
        append_to_response: 'videos,credits'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(tvshowResponseFromApi => TvShowModelMapper.mapFromTmdb(tvshowResponseFromApi))
      );
  }

  /**
   * API TMBD
   * tv/{series_id}/season/{season_number}
   * @param serieId
   * @param seasonNumber
   */
  getEpisodesFromApi(serieId: number, seasonNumber: number): Observable<any> {
    const ENDPOINT = `/tv/${serieId}/season/${seasonNumber}`;
    let options = {
      params: {
        language: 'fr',
        append_to_response: 'videos'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
  }



  /**
   * API TMDB
   * role : récupérer un film
   * endpoint: /movie/{id}
   * queryParam: append_to_response=videos
   * @returns @Observable<MovieModel>
   */
  getMovieFromApi(id: string): Observable<MovieModel> {
    const ENDPOINT = `/movie/${id}`;
    let options = {
      params: {
        language: 'fr',
        append_to_response: 'videos,credits'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(response => MovieModelMapper.mapFromTmdb(response))
      );
  }

  /**
   * API TMDB
   * role : rechercher un film, une série ou une personne
   * endpoint /search/multi
   * queryParams userSearchText : string
   * @returns Observable<any> (movies, tvshows, or people)
   */
  search(userSearchText: string): Observable<any> {
    let ENDPOINT = '/search/multi';
    let options = {
      params: {
        language: 'fr',
        query: userSearchText,
        append_to_response: 'videos,credits'
      }
    }
    return this.http.get(this.TMDB_URL + ENDPOINT, options)
      .pipe(
        map(
          (response: any) => response.results.map((item: any) => new SearchModel(item))
        ),
        tap(
          (searchResult) => this._searchResults$.next(searchResult)
        )
      )
  }


}
