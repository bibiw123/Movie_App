import { Component } from '@angular/core';
import { MovieModel } from '../../core/models/movie.model';
import { TvShowModel } from '../../core/models/serie.model';
import { TMDBGateway } from '../../core/ports/tmdb.gateway';
import { UserGateway } from '../../core/ports/user.gateway';
import { AuthGateway } from '../../core/ports/auth.gateway';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss'
})
export class HomeViewComponent {

  randomSlider!: MovieModel[]; // 6 films au hasard pour le slider
  movies!: MovieModel[]; // 6 films à afficher
  series!: TvShowModel[]; // 6 series à afficher
  suggestions: (MovieModel | TvShowModel)[] = []; // suggestions films et series du user

  constructor(public TmdbGateway: TMDBGateway, public authGateway: AuthGateway, public userGateway: UserGateway) { }

  ngOnInit() {
    // recuperer les movies
    this.TmdbGateway.getMoviesFromApi();
    // récuperer les series
    this.TmdbGateway.getTvShowFromApi();


    // filtrer les 6 premiers movies à afficher
    this.TmdbGateway.movies$.subscribe(moviesFromSource => {
      this.movies = moviesFromSource.slice(0, 6)
      this.randomSlider = moviesFromSource.slice(7, 15)
    })
    // filtrer les 6 premières series à afficher
    this.TmdbGateway.tv$.subscribe(seriesFromSource => {
      this.series = seriesFromSource.slice(0, 6)
    });


    // récuperer les films et series de l'utilisateur
    this.userGateway.user$.subscribe(user => {
      if (user) {
        const movies = user?.watchList?.movies;
        const series = user?.watchList?.series;
        // creer un tableau de suggestions de films et series de l'utilisateur
        if (movies && series)
          this.suggestions = this.shuffle([...movies, ...series]).slice(0, 6);
      }
    });

  }


  /** UTILS */
  /**
   * Shuffle array
   */
  shuffle(media: (MovieModel | TvShowModel)[]): any {
    return media.sort(() => Math.random() - 0.5);
  }
  /**
   * Check if the data is a MovieModel
   */
  isMovie(data: any): data is MovieModel {
    if (data !== null && typeof data == 'object') {
      return ('episode_count' in data) === false
    }
    return false
  }
  /**
   * Check if the data is a TvShowModel
   */
  isSerie(data: any): data is TvShowModel {
    if (data !== null && typeof data == 'object') {
      return 'episode_count' in data
    }
    return false
  }

}
