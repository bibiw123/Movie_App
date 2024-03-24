import { Component } from '@angular/core';
import { MovieModel } from '../../core/models/movie.model';
import { TvShowModel } from '../../core/models/series.model';
import { TMDBGateway } from '../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss'
})
export class HomeViewComponent {

  movies!: MovieModel[];
  tv!: TvShowModel[];
  pagination = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(
    public TmdbGateway: TMDBGateway
  ) { }

  ngOnInit() {
    // recuperer les 5 premiers movies
    this.TmdbGateway.getMoviesFromApi();
    // récuperer les 5 premieres series
    this.TmdbGateway.getTvShowFromApi();
  }

  findNextMoviesAction(pageNumber?: number) {
    if (pageNumber) {
      this.TmdbGateway.getNextMoviesFromApi(pageNumber)
    }
    else {
      this.TmdbGateway.getNextMoviesFromApi()
    }
  }

  findPrevMoviesAction() {
    this.TmdbGateway.getPrevMoviesFromApi()
  }

}
