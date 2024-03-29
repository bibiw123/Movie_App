import { Component } from '@angular/core';
import { AuthGateway } from './core/ports/auth.gateway';
import { Observable, combineLatest, debounceTime, fromEvent, interval, tap, throttle } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movieapp';
  isLoading$ = this.loaderService.isLoading;

  constructor(private authGateway: AuthGateway, private loaderService: LoaderService) { }

  ngOnInit() {
    this.userIsInactiveSince(1).subscribe((event) => {
      console.log('logout apres 10 secondes');
      this.authGateway.logout()
    });
  }

  /**
   * Role: emit a value after X minutes of user inactivity
   * @param durationInMinutes
   * @returns Observable<Event[]>
   */
  userIsInactiveSince(durationInMinutes: number): Observable<Event[]> {
    const click$ = fromEvent(document, 'click')
    const keyup$ = fromEvent(document, 'keydown');
    const mousemove$ = fromEvent(document, 'mousemove');
    return combineLatest([click$, keyup$, mousemove$])
      .pipe(debounceTime(durationInMinutes * 60000)) // quand le user arrête toute activité au bout de X minutes)
  }


}
