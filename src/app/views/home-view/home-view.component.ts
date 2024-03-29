import { Component } from '@angular/core';
import { MovieModel } from '../../core/models/movie.model';
import { TvShowModel } from '../../core/models/serie.model';
import { TMDBGateway } from '../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss'
})
export class HomeViewComponent {

  movies!: MovieModel[]; // 6 films à afficher
  series!: TvShowModel[]; // 6 series à afficher
  randomSlider!: MovieModel[]; // 6 films au hasard pour le slider

  constructor(
    public TmdbGateway: TMDBGateway
  ) { }

  ngOnInit() {
    // recuperer les movies
    this.TmdbGateway.getMoviesFromApi();
    // récuperer les series
    this.TmdbGateway.getTvShowFromApi();


    // filtrer les 6 premiers movies à afficher
    this.TmdbGateway.movies$.subscribe(moviesFromSource => {
      this.movies = moviesFromSource.slice(0, 6)
      const random = this.getRandomInt(7, moviesFromSource.length - 1);
      this.randomSlider = moviesFromSource.slice(random, moviesFromSource.length - 1) // films au hasard pour le slider
    })
    // filtrer les 6 premières series à afficher
    this.TmdbGateway.tv$.subscribe(seriesFromSource => {
      this.series = seriesFromSource.slice(0, 6)
    });


  }

  // utils
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}
