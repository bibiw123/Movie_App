import { Component } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TMDBService } from '../../../core/adapters/tmdb.service';
import { TvShowModel } from '../../../core/models/serie.model';
import { Location } from '@angular/common';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { UserGateway } from '../../../core/ports/user.gateway';
import { FormControl } from '@angular/forms';
import { UIButtonDataModel } from '../../../shared/ui-components/ui-button-group/ui-button-group.component';

@Component({
  selector: 'app-tv-detail-view',
  templateUrl: './tv-detail-view.component.html',
  styleUrl: './tv-detail-view.component.scss'
})
export class TvDetailViewComponent {
  serie!: TvShowModel;
  seasonDetails: any;
  selectSeasonAction: FormControl = new FormControl();

  constructor(
    private _route: ActivatedRoute,
    private _sanitize: DomSanitizer,
    public location: Location,
    private _TmdbGateway: TMDBGateway,
    public authGateway: AuthGateway,
    public userGateway: UserGateway,
  ) { }

  ngOnInit() {
    // récupérer l'id de la série dans l'URL
    const tvShowId: string = this._route.snapshot.params['id'];
    // fetch de la série
    this._TmdbGateway.getOneTvShowFromApi(tvShowId).subscribe((tvshow: TvShowModel) => {
      this.serie = tvshow;
      this.selectSeasonAction.setValue(tvshow.seasons[0]);
    });
    // fetch des épisodes d'une saison quand l'utilisateur selectionne une saison
    this.selectSeasonAction.valueChanges.subscribe(season => {
      this._TmdbGateway.getEpisodesFromApi(this.serie.tmdb_id, season.season_number)
        .subscribe((seasonDetails: any) => {
          this.seasonDetails = seasonDetails;
        });
    });
  }

  getFullVideoUrl(key: string): SafeResourceUrl {
    return this._sanitize.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + key);
  }

  getBackdropImage(tvshow: TvShowModel) {
    return `background: url(https://image.tmdb.org/t/p/w1280/${tvshow.image_landscape})`;
  }

  getFullImageUrl(image: string) {
    return image
      ? `https://image.tmdb.org/t/p/w500/${image}`
      : `https://image.tmdb.org/t/p/w500/${this.serie.image_landscape}`;
  }



  addSerieToWatchListAction(serie: TvShowModel) {
    // appeler la methode du service userGateway.postSerie(serie) et en cas de succès
    // appeler la methode userGateway.postEpisodes(serie, this.seasonDetails.episodes, apiResponse.id_tmdb)
    this.userGateway.postSerie(serie).pipe(
      switchMap(
        (apiResponse: any) => {
          serie.api_id = apiResponse.id
          return this.userGateway.postEpisodes(
            serie,
            this.seasonDetails.episodes,
            apiResponse.seasons[0].id_tmdb,
            0
          )
        }
      )
    ).subscribe()
  }

  removeSerieToWatchListAction(serie: TvShowModel) {
    console.log(serie);
    const userWatchList = this.userGateway.getUser().watchList.series
    const foundSerie = userWatchList.find(item => item.tmdb_id === serie.tmdb_id)
    if (foundSerie) this.userGateway.deleteSerie(foundSerie.api_id)
  }


  changeEpisodeWatchedStatus(event: number, episode: any) {
    const status: number = event;
    this.userGateway.postEpisodes(this.serie, [episode], this.seasonDetails.id, status)
      .subscribe()
  }

}
