import { Component } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {

  movies:MovieModel[] = [

  ]

}
