import { Component } from '@angular/core';
import { SearchModel } from '../../core/models/search.model';
import { TMDBGateway } from '../../core/ports/tmdb.gateway';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrl: './search-view.component.scss'
})
export class SearchViewComponent {

  constructor(private tmdbGateway : TMDBGateway){}
  results$ = this.tmdbGateway.searchResults$;

  // getSearchResults(results: any) {
  //   this.results = results
  // }

}
