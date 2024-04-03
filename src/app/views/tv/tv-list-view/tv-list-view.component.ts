import { Component } from '@angular/core';
import { TvShowModel } from '../../../core/models/serie.model';
import { Observable } from 'rxjs';
import { Genre, genresTv } from '../../../shared/data/genres.data';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-tv-list-view',
  templateUrl: './tv-list-view.component.html',
  styleUrl: './tv-list-view.component.scss'
})
export class TvListViewComponent {

  // Observable tvshows$ (source de données des séries)
  // on s'y abonne dans le template HTML (tvshows$ | async)
  tvshows$: Observable<TvShowModel[]> = this._TmdbGateway.tv$;
  genres: Genre[] = genresTv;

  constructor(private _TmdbGateway: TMDBGateway) { }

  ngOnInit() {
    // Récupération de la liste des series de TMDB
    this._TmdbGateway.getTvShowFromApi();
  }

  selectGenre(genre: Genre) {
    // Récupération des séries en fonction du genre sélectionné
    this._TmdbGateway.getTvShowFromApi(genre.id);
  }

  /**
   * Role: récupérer les 20 séries suivantes
   */
  findNextMoviesAction() {
    this._TmdbGateway.getNextTvShowFromApi()
  }

}
