import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { TMDBGateway } from '../../../core/ports/tmdb.gateway';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { UserGateway } from '../../../core/ports/user.gateway';

@Component({
  selector: 'app-movie-detail-view',
  templateUrl: './movie-detail-view.component.html',
  styleUrl: './movie-detail-view.component.scss'
})
export class MovieDetailViewComponent implements OnInit {

  movie$!: Observable<MovieModel>
  movie!: MovieModel
  movieStatus: number = 0;

  constructor(
    public location: Location,
    private _route: ActivatedRoute,
    private _TmdbGateway: TMDBGateway,
    public authGateway: AuthGateway,
    public userGateway: UserGateway
  ) { }

  ngOnInit() {
    // 1 On récupere l'id dans l'URL
    const movieId: string = this._route.snapshot.params['id'];
    // 2 On demande au service de nous donner le film correspondant
    this.movie$ = this._TmdbGateway.getMovieFromApi(movieId);
    // 3 Pour afficher @if(movie$ | async; as movie) dans la vue HTML

    this.movie$.subscribe(movie => {
      this.movie = movie;
      console.log(this.movie);
      let myMovie = this.userGateway.getUser().watchList.movies.find(movie => movie.tmdb_id === this.movie.tmdb_id);
      this.movieStatus = myMovie ? myMovie.status ? myMovie.status : 0 : 0;
      console.log(this.movieStatus);
    })


  }

  getFullImageUrl(fragmentUrl: string) {
    if (fragmentUrl == null) {
      return "https://placehold.co/500x750?text=Image+non+disponible"
    }
    else {
      return 'https://image.tmdb.org/t/p/w500' + fragmentUrl;
    }
  }

  addMovieToWatchListAction(movie: MovieModel) {
    this.userGateway.postMovie(movie)
  }

  removeMovieToWatchListAction(movie: MovieModel) {
    const userWatchList = this.userGateway.getUser().watchList.movies
    const foundMovie = userWatchList.find(item => item.tmdb_id === movie.tmdb_id)
    if (foundMovie) this.userGateway.deleteMovie(foundMovie.api_id)
  }

  changeMovieWatchedStatus(event: 0 | 1 | 2 | 3) {
    //this.userGateway.patchMovie($event)
    this.movieStatus = event;
    let user = this.userGateway.getUser();
    let movie = this.movie;
    let foundMovieInWatchList = user.watchList.movies.find(movie => movie.tmdb_id === this.movie.tmdb_id);
    if (foundMovieInWatchList) {
      movie.api_id = foundMovieInWatchList.api_id;
    }
    this.userGateway.PostMovieStatusChange(this.movie, event).subscribe()
  }

}
