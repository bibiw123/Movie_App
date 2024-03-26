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
  selectSeasonField: FormControl = new FormControl();


  constructor(
    private _route: ActivatedRoute,
    private _sanitize: DomSanitizer,
    public location: Location,
    private _TmdbGateway: TMDBGateway,
    public authGateway: AuthGateway,
    public userGateway: UserGateway
  ) { }

  ngOnInit() {
    // 1 On récupere l'id de la série dans l'URL
    const tvShowId: string = this._route.snapshot.params['id'];
    this._TmdbGateway.getOneTvShowFromApi(tvShowId).subscribe((tvshow: TvShowModel) => {
      this.serie = tvshow;

    });

    this.selectSeasonField.valueChanges.subscribe(value => {
      console.log(value);
      this._TmdbGateway.getEpisodesFromApi(this.serie.id, value)
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
