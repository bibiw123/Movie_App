import { Component, Input } from '@angular/core';
import { MovieModel } from '../../../core/models/movie.model';

@Component({
  selector: 'ui-slider',
  templateUrl: './ui-slider.component.html',
  styleUrl: './ui-slider.component.scss'
})
export class SliderComponent {

  @Input() items!: MovieModel[] | null
  activeSlide: number = 0
  sliders = this.items

  ngOnInit() {

    console.log(this.items)
  }

  nextSlide() {
    this.activeSlide++;
    if (this.activeSlide > this.sliders!.length - 1) {
      this.activeSlide = 0;
    }
  }

  previousSlide() {
    this.activeSlide--;
    if (this.activeSlide < 0) {
      this.activeSlide = this.sliders!.length - 1;
    }
  }

  getFullImageUrl(fragmentUrl: string): string {
    return `url(https://image.tmdb.org/t/p/original/${fragmentUrl})`;
  }
}
