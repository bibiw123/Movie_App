import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Genre } from '../../data/genres.data';
import { SeasonModel } from '../../../core/models/series.model';

@Component({
  selector: 'ui-dropdown',
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss'
})
export class DropdownComponent {
  @Input({ required: true }) items!: Genre[];
  @Output() OnSelectItemEvent = new EventEmitter<Genre>();

  isMenuOpened: boolean = false;
  selectedGenre!: Genre | undefined | SeasonModel;

  openCloseMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
  closeMenu() {
    this.isMenuOpened = false;
  }
  selectItemAction(item: Genre) {
    this.OnSelectItemEvent.emit(item);
    this.isMenuOpened = false;
    this.selectedGenre = item;
  }


}
