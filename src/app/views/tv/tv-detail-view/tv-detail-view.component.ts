import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TvShowModel } from '../../../core/models/serie.model';
import { Location } from '@angular/common';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { UserGateway } from '../../../core/ports/user.gateway';
import { FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-tv-detail-view',
  templateUrl: './tv-detail-view.component.html',
  styleUrl: './tv-detail-view.component.scss'
})
export class TvDetailViewComponent {
  // data
  serie!: TvShowModel;
  seasonDetails: any;
  serieStatus: number = 0;
  selectSeasonAction: FormControl = new FormControl();
  // Subscriptions
  getSerieSub$!: Subscription;
  getSeasonSub$!: Subscription;
  postSerieSub$!: Subscription;
  postEpisodeSub$!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _sanitize: DomSanitizer,
    public location: Location,
    private _TmdbGateway: TMDBGateway,
    public authGateway: AuthGateway,
    public userGateway: UserGateway,
    public loaderService: LoaderService
  ) { }


  ngOnInit() {
    // récupérer l'id de la série dans l'URL
    const tvShowId: number = this._route.snapshot.params['id'];
    // fetch de la série
    this._TmdbGateway.getOneTvShowFromApi(tvShowId)
      .subscribe((tvshow: TvShowModel) => {
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


  /**
   * ACTIONS 
   */
  addSerieToWatchListAction(serie: TvShowModel) {
    this.userGateway.postSerie(serie).subscribe()
  }

  removeSerieToWatchListAction(serie: TvShowModel) {
    const userWatchList = this.userGateway.getUser()?.watchList.series
    const foundSerie = userWatchList?.find(item => item.tmdb_id === serie.tmdb_id)
    if (foundSerie) this.userGateway.deleteSerie(foundSerie.api_id)
  }

  changeEpisodeWatchedStatus(status: number, episode: any) {
    this.userGateway.postEpisodes(this.serie, [episode], this.seasonDetails.id, status).subscribe()
  }

  /**
   * HELPERS
   */
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

  // getEpisodeStatus(seasonTmdbid: number, episodeTmdbid: any) {
  //   let user = this.userGateway.getUser();
  //   let foundSerieInWatchList = user?.watchList.series.find(serie =>
  //     serie.tmdb_id === this.serie.tmdb_id
  //   );
  //   if (foundSerieInWatchList) {
  //     let foundSeasonInWatchList = foundSerieInWatchList.seasons.find(season =>
  //       season.tmdb_id === seasonTmdbid
  //     );
  //     if (foundSeasonInWatchList) {
  //       let foundEpisodeInWatchList = foundSeasonInWatchList.episodes.find(episode => episode.tmdb_id === episodeTmdbid);
  //       if (foundEpisodeInWatchList) {
  //         return foundEpisodeInWatchList.status;
  //       }
  //     }
  //   }
  //   return 0;

  // }


  /**
   * Unsuscribe from all subscriptions
   */
  ngOnDestroy() {
    this.getSerieSub$?.unsubscribe();
    this.getSeasonSub$?.unsubscribe();
    this.postSerieSub$?.unsubscribe();
    this.postEpisodeSub$?.unsubscribe();
  }

}
