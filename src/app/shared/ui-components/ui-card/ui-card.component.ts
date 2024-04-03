import { Component, Input } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { TvShowModel } from '../../../core/models/serie.model';
import { SearchModel } from '../../../core/models/search.model';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss'
})
export class CardComponent {
  // les inputs
  @Input() item!: MovieModel | TvShowModel | SearchModel;
  @Input() type!: string | undefined;

  isMediaInWatchList: boolean = false;
  isLoading: boolean = false

  constructor(
    private userGateway: UserGateway,
    public loaderService: LoaderService,
    public authGateway: AuthGateway) { }

  ngOnInit() {

    /** isLoading */
    this.loaderService.isLoading.subscribe(isLoading => this.isLoading = isLoading);

    /**
     * A l'initiation du component UiCardComponent
     * on vérifie si l'item film/série est déjà dans la watchlist de l'utilisateur
     * si oui, on set isMediaInWatchList à true 
     * (permet d'afficher le bouton "<3" en rouge dans la view HTML)
     */
    this.userGateway.user$.subscribe(user => {
      // si le media est un film
      if (this.isMovie(this.item) || (this.isSearch(this.item) && this.item.media_type === 'movie')) {
        const foundMovieInWatchList = user?.watchList?.movies.find((movie: any) => movie.tmdb_id === this.item.tmdb_id);
        if (foundMovieInWatchList) {
          this.item.api_id = foundMovieInWatchList.api_id;;
          this.isMediaInWatchList = true
        }
        else {
          this.isMediaInWatchList = false;
        }
      }
      // si le media est une série
      if (this.isSerie(this.item) || (this.isSearch(this.item) && this.item.media_type === 'tv')) {
        const foundSerieInWatchList = user?.watchList?.series.find((serie: any) => serie.tmdb_id === this.item.tmdb_id);
        if (foundSerieInWatchList) {
          this.item.api_id = foundSerieInWatchList.api_id;
          this.isMediaInWatchList = true
        }
        else {
          this.isMediaInWatchList = false;
        }

      }
    });

  }


  /**
   * addOrRemoveMediaToWatchlistAction(item)
   * role: au clic sur le bouton "<3", 
   * on ajoute/retire le film/série à la watchlist de l'utilisateur
   * @param item MovieModel | TvShowModel | SearchModel
   * @param event Event
   * @returns void
   */
  addOrRemoveMediaToWatchlistAction(item: MovieModel | TvShowModel | SearchModel, event: Event) {
    event.stopPropagation();
    // si le media est un film
    if (this.isMovie(item) || (this.isSearch(item) && item.media_type === 'movie')) {
      if (this.isMediaInWatchList && item.api_id) {
        // supprimer le film de la watchlist
        this.userGateway.deleteMovie(item.api_id)
      } else {
        // ajouter le film à la watchlist
        this.userGateway.postMovie(item as MovieModel)
      }
    }
    // si le media est une série
    if (this.isSerie(item) || (this.isSearch(item) && item.media_type === 'tv')) {

      if (this.isMediaInWatchList && item.api_id) {
        // supprimer la série de la watchlist
        this.userGateway.deleteSerie(item.api_id);
      }
      else {
        // ajouter la série à la watchlist
        this.userGateway.postSerie(item as TvShowModel).subscribe();
      }
    }
  }


  /******* UTILS ********/
  /**
   * Check if the data is a MovieModel
   */
  isMovie(data: any): data is MovieModel {
    if (data !== null && typeof data == 'object') {
      return ('episode_count' in data) === false
    }
    return false
  }

  /**
   * Check if the data is a TvShowModel
   */
  isSerie(data: any): data is TvShowModel {
    if (data !== null && typeof data == 'object') {
      return 'episode_count' in data
    }
    return false
  }
  /**
   * Check if the data is a SearchModel
   */
  isSearch(data: any): data is SearchModel {
    if (data !== null && typeof data == 'object') {
      return 'media_type' in data
    }
    return false
  }

  /**
   * Role: retourne l'url de l'image complète
   * @param fragmentUrl 
   * @returns string
   */
  getFullImageUrl(fragmentUrl: string): string {
    return 'https://image.tmdb.org/t/p/w500' + fragmentUrl;
  }
}
