import { Component, Input, OnInit } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';
import { TvShowModel } from '../../../core/models/tv-show.model';
import { SearchModel } from '../../../core/models/search.model';


@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss'
})
export class CardComponent {
  @Input() item!: MovieModel | TvShowModel | SearchModel;


  getFullImageUrl(fragmentUrl: string) {
    return 'https://image.tmdb.org/t/p/w500' + fragmentUrl;
  }

}
