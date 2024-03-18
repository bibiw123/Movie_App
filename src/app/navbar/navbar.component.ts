import { Component } from '@angular/core';
import { AuthGateway } from '../core/ports/auth.gateway';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(public authGateway:AuthGateway){}
}
