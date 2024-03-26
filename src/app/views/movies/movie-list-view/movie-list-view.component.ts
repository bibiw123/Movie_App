import { Component } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { Observable } from 'rxjs';
import { Genre, genresMovie } from '../../../shared/data/genres.data';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-movie-list-view',
  templateUrl: './movie-list-view.component.html',
  styleUrl: './movie-list-view.component.scss'
})
export class MovieListViewComponent {

  movies$: Observable<MovieModel[]> = this._TmdbGateway.movies$
  genres: Genre[] = genresMovie;

  constructor(private _TmdbGateway: TMDBGateway) { }

  /**                appelle
  *  |1.COMPONENT | ==========> |2.TMDBService|                 
  *                             .getMoviesFromApi()       
  *                             pousse _movies$.next(allMovies)
  *  |3.VUE HTML|
  *  affiche: TMDBService.movies$ | async
  */

  ngOnInit() {
    this._TmdbGateway.getMoviesFromApi();
  }

  selectGenre(genre: Genre) {
    console.log(genre)
    // Request TMDV /movie/
  }

  findNextMoviesAction(pageNumber?: number) {
    this._TmdbGateway.getNextMoviesFromApi()
  }

}
