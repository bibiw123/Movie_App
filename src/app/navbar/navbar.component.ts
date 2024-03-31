import { Component } from '@angular/core';
import { AuthGateway } from '../core/ports/auth.gateway';
import { UserGateway } from '../core/ports/user.gateway';
import { UserService } from '../core/adapters/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isMenuOpened: boolean = false;

  constructor(
    public authGateway: AuthGateway,
    public userGataway: UserGateway) { }

  openNav() {
    this.isMenuOpened = true
  }
  closeNav() {
    this.isMenuOpened = false
  }
  logoutAction() {
    this.authGateway.logout()
  }
}
