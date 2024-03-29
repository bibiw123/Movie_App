import { Component, Input } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';

@Component({
  selector: 'ui-slider',
  templateUrl: './ui-slider.component.html',
  styleUrl: './ui-slider.component.scss'
})
export class SliderComponent {

  // en entrée, on reçoit un tableau d'items de type MovieModel
  // on peut alors itérer sur ce tableau pour afficher les items du slider
  @Input() items!: MovieModel[];
  activeSlide: number = 0


  nextSlide() {
    this.activeSlide++;
    if (this.activeSlide > this.items.length - 1) {
      this.activeSlide = 0;
    }
  }

  previousSlide() {
    this.activeSlide--;
    if (this.activeSlide < 0) {
      this.activeSlide = this.items.length - 1;
    }
  }

  getFullImageUrl(fragmentUrl: string): string {
    return `url(https://image.tmdb.org/t/p/original/${fragmentUrl})`;
  }
}
