import { Component, ViewEncapsulation } from '@angular/core';
import { TMDBGateway } from '../../../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrl: './actionbar.component.scss'
})
export class ActionbarComponent {

  constructor(private _TmdbGateway: TMDBGateway) { }

  nextMoviesAction() {
    this._TmdbGateway.getNextMoviesFromApi();
  }

}
