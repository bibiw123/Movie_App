import { Component } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { UserGateway } from '../../../core/ports/user.gateway';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {

  constructor(public userService: UserGateway) { }

}
