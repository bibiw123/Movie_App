import { Component } from '@angular/core';
import { AuthGateway } from './core/ports/auth.gateway';
import { Observable, combineLatest, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movieapp';

  constructor(private authGateway: AuthGateway) { }

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
    const clicksObs = fromEvent(document, 'click');
    const keyupObs = fromEvent(document, 'keydown');
    const mousemoveObs = fromEvent(document, 'mousemove');
    return combineLatest([clicksObs, keyupObs, mousemoveObs])
      .pipe(debounceTime(durationInMinutes * 60000)) // quand le user arrête toute activité au bout de X minutes)
  }


}
