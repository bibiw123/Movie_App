import { Component } from '@angular/core';
import { SearchModel } from '../../core/models/search.model';
import { TMDBGateway } from '../../core/ports/tmdb.gateway';
import { MovieModel } from '../../core/models/movie.model';
import { TvShowModel } from '../../core/models/serie.model';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrl: './search-view.component.scss'
})
export class SearchViewComponent {

  constructor(private tmdbGateway: TMDBGateway) { }

  results: (MovieModel | TvShowModel | SearchModel)[] = [];

  ngOnInit() {
    this.tmdbGateway.searchResults$.subscribe(results => {
      this.results = results
        .map(media => {
          if (this.isMovie(media)) return media as MovieModel
          if (this.isSerie(media)) return media as TvShowModel
          return media as SearchModel
        })
        // on filtre les personnes pour les exclure de la liste des résultats
        .filter((media: any) => media.media_type !== 'person')
    })
  }


  /******* UTILS ********/
  /**
   * Check if the data is a MovieModel
   */
  isMovie(data: any): data is MovieModel {
    if (data !== null && typeof data == 'object') {
      return data.media_type === 'movie'
    }
    return false
  }

  /**
   * Check if the data is a TvShowModel
   */
  isSerie(data: any): data is TvShowModel {
    if (data !== null && typeof data == 'object') {
      return data.media_type === 'tv'
    }
    return false
  }


}
