import { Component } from '@angular/core';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { Observable } from 'rxjs';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {

  user$: Observable<UserModel> = this.userService.user$

  constructor(
    public authService: AuthGateway,
    public userService: UserGateway
  ) { }

}
