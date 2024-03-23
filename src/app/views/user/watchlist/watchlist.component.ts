import { Component } from '@angular/core';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {

  constructor(
    public authService: AuthGateway,
    public userService: UserGateway
  ) { }

}
