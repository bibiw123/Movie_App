import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TMDBService } from '../../../core/adapters/tmdb.service';
import { TvShowModel } from '../../../core/models/series.model';
import { Location } from '@angular/common';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { UserGateway } from '../../../core/ports/user.gateway';
import { FormControl } from '@angular/forms';

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
    public userGateway: UserGateway
  ) { }

  ngOnInit() {
    // id de la série dans l'URL
    const tvShowId: string = this._route.snapshot.params['id'];
    // Récupération de la série
    this._TmdbGateway.getOneTvShowFromApi(tvShowId).subscribe((tvshow: TvShowModel) => {
      this.serie = tvshow;
    });
    // Récupération des épisodes d'une saison
    this.selectSeasonAction.valueChanges.subscribe(season => {
      this._TmdbGateway.getEpisodesFromApi(this.serie.id, season.season_number)
        .subscribe((seasonDetails: any) => {
          console.log(seasonDetails)
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
    return `https://image.tmdb.org/t/p/w500/${image}`;
  }

}
