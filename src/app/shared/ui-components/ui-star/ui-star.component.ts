import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-star',
  templateUrl: './ui-star.component.html',
  styleUrl: './ui-star.component.scss'
})
export class UiStarComponent {

  @Input() score!: number
  scoreArray!:any[];

  ngOnInit() {
    // je veux un array qui contient autant de  valeur que le score
    // [0,0]
    this.score = Math.round(this.score/2)
    this.scoreArray = new Array(this.score).fill(0)
  }
}
