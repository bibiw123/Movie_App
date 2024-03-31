import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs';
import { SearchModel } from '../../../core/models/search.model';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-searchbar',
  templateUrl: './ui-searchbar.component.html',
  styleUrl: './ui-searchbar.component.scss'
})
export class SearchbarComponent {

  searchInput = new FormControl();
  @Output() onResultsEvent = new EventEmitter()

  constructor(private _TmdbGateway: TMDBGateway, private _router: Router) { }

  ngOnInit() {
    // 1 traiter la saisie du user
    //   debounceTime(500) : attend 500ms après la dernière saisie
    let search$ = this.searchInput.valueChanges.pipe(
      debounceTime(500)
    );

    // 2 request search
    //   switchMap : annule la requête précédente si une nouvelle est émise
    search$
      .pipe(
        switchMap(data => this._TmdbGateway.search(data))
      )
      .subscribe((data: SearchModel[]) => {
        this.onResultsEvent.emit(data)
      })
  }















  // /**
  //  * 
  //  * @returns Observable<boolean>
  //  */
  // scrollingFinished$(): Observable<boolean> {
  //   let emitted: boolean = false;
  //   return fromEvent(window, 'scroll').pipe(
  //     map(() => {
  //       if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !emitted) {
  //         emitted = true;
  //         return true;
  //         //this.scrollingFinished.emit();
  //       } else {
  //         emitted = false;
  //         return false;
  //       }
  //     }),
  //     //debounceTime(100),
  //     filter(val => val === true)
  //   )
  // }



}
