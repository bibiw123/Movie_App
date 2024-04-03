import { Component } from '@angular/core';
import { AuthGateway } from '../core/ports/auth.gateway';
import { UserGateway } from '../core/ports/user.gateway';
import { UserService } from '../core/adapters/user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isMenuOpened: boolean = false;
  isAuth$: Observable<boolean> = this.authGateway.isAuth$;
  user = this.userGataway.getUser();

  constructor(
    public authGateway: AuthGateway,
    public userGataway: UserGateway,
    private router: Router
  ) { }

  openOrCloseNav() {
    this.isMenuOpened = !this.isMenuOpened
  }

  logoutAction() {
    this.authGateway.logout()
  }

  navigateTo(route: string) {
    this.isMenuOpened = false;
    this.router.navigate([route]);
  }

  navigateToUserList() {
    this.isMenuOpened = false;
    const isAuthenticaded = this.authGateway.isAuth();
    if (isAuthenticaded) {
      this.router.navigate(['watchlist']);
    } else {
      this.router.navigate(['login']);
    }

  }
}
