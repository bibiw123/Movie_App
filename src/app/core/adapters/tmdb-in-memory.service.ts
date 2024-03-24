import { Injectable } from '@angular/core';
import { TMDBGateway } from '../ports/tmdb.gateway';
import { MovieModel } from '../models/movie.model';
import { Observable, of } from 'rxjs';
import { TvShowModel } from '../models/series.model';
import { moviesData } from './data/movies.data';
import { tvShowsData } from './data/series.data';
import { SearchModel } from '../models/search.model';
import { searchData } from './data/search.data'

@Injectable({
  providedIn: 'root'
})
export class APIInMemoryService implements TMDBGateway {

  tv$!: Observable<TvShowModel[]>
  movies$!: Observable<MovieModel[]>;
  movies: MovieModel[] = moviesData;
  tvShows: TvShowModel[] = tvShowsData;
  searchData: SearchModel[] = searchData;

  getMoviesFromApi(): Observable<MovieModel[]> {
    return of(this.movies);
  }

  getPrevMoviesFromApi(): Observable<MovieModel[]> {
    return of(this.movies);
  }

  getMovieFromApi(id: string): Observable<MovieModel> {
    let movie = this.movies.find(movie => movie.id.toString() === id);
    if (!movie) {
      throw new Error('not found');
    }
    return of(movie);
  }

  getNextMoviesFromApi(): Observable<MovieModel[]> {
    return of(this.movies);
  }

  getTvShowFromApi(): Observable<TvShowModel[]> {
    return of(this.tvShows)

  }
  getOneTvShowFromApi(id: string): Observable<TvShowModel> {
    let tvShow = this.tvShows.find(tvShow => tvShow.id.toString() === id);
    if (!tvShow) {
      throw new Error('not found');
    }
    return of(tvShow);
  }

  search(userSearchText: string): Observable<any> {
    return of(this.searchData)

  }

  constructor() { }
}
