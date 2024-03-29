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

  tvshows$: Observable<TvShowModel[]> = this._TmdbGateway.tv$;
  genres: Genre[] = genresTv;

  constructor(private _TmdbGateway: TMDBGateway) { }

  ngOnInit() {
    this._TmdbGateway.getTvShowFromApi();
  }

  selectGenre(genre: Genre) {
    console.log(genre)
  }

  findNextMoviesAction() {
    this._TmdbGateway.getNextTvShowFromApi()
  }

}
