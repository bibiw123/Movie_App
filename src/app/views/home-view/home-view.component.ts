import { Component } from '@angular/core';
import { MovieModel } from '../../core/models/movie.model';
import { TvShowModel } from '../../core/models/tv-show.model';
import { TMDBService } from '../../core/adapters/tmdb.service';
import { APIExternalMoviesGateway } from '../../core/ports/api-external-movies.gateway';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss'
})
export class HomeViewComponent {

  movies!: MovieModel[];
  tv!: TvShowModel[];
  pagination = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  activeSlide = 0;
  sliders!: MovieModel[];

  subscription!: Subscription;

  constructor(
    //private _TMDBSvc: TMDBService
    public TMDBSvc: APIExternalMoviesGateway,
    private _sanitize: DomSanitizer
  ) { }




  nextSlide() {
    this.activeSlide++;
    if (this.activeSlide > this.sliders.length - 1) {
      this.activeSlide = 0;
    }
  }

  previousSlide() {
    this.activeSlide--;
    if (this.activeSlide < 0) {
      this.activeSlide = this.sliders.length - 1;
    }
  }

  ngOnInit() {
    // recuperer les 5 premiers movies
    this.TMDBSvc.getMoviesFromApi();
    // récuperer les 5 premieres series
    this.TMDBSvc.getTvShowFromApi(); // request à TMDB -> this.tv$.subscribe()
  }

  findNextMoviesAction(pageNumber?: number) {
    if (pageNumber) {
      this.TMDBSvc.getNextMoviesFromApi(pageNumber)
    }
    else {
      this.TMDBSvc.getNextMoviesFromApi()
    }
  }

  findPrevMoviesAction() {
    this.TMDBSvc.getPrevMoviesFromApi()
  }

  getFullImageUrl(fragmentUrl: string): string {
    return `url(https://image.tmdb.org/t/p/original/${fragmentUrl})`;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('ceci va s\'executer juste avant la destruction du component HomeView')
  }

}
