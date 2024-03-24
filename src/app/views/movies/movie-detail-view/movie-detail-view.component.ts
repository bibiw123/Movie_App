import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';


@Component({
  selector: 'app-movie-detail-view',
  templateUrl: './movie-detail-view.component.html',
  styleUrl: './movie-detail-view.component.scss'
})
export class MovieDetailViewComponent implements OnInit {

  movie$!: Observable<MovieModel>

  constructor(
    public location: Location,
    private _route: ActivatedRoute,
    private _sanitize: DomSanitizer,
    private _TmdbGateway: TMDBGateway,
    public authGateway: AuthGateway
  ) { }

  ngOnInit() {
    // 1 On récupere l'id dans l'URL
    const movieId: string = this._route.snapshot.params['id'];
    // 2 On demande au service de nous donner le film correspondant
    this.movie$ = this._TmdbGateway.getMovieFromApi(movieId)
    // 3 Pour afficher @if(movie$ | async; as movie) dans la vue HTML
  }

  getFullVideoUrl(key: string): SafeResourceUrl {
    return this._sanitize.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + key);
  }

  getFullImageUrl(fragmentUrl: string) {
    return 'https://image.tmdb.org/t/p/w500' + fragmentUrl;
  }

  addMovieToWatchlistAction(movie: MovieModel) {
    console.log(movie);
  }

}
