import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleAppearance } from '@angular/material/button-toggle';

export type UIButtonDataModel = {
  label: string;
  value: any;
};
@Component({
  selector: 'ui-button-group',
  templateUrl: './ui-button-group.component.html',
  styleUrl: './ui-button-group.component.scss'
})
export class ButtonGroupComponent {

  @Input() status: number = 0;

  watchedStatusButtons: UIButtonDataModel[] = [
    { label: 'A voir', value: 0 },
    { label: 'En cours', value: 1 },
    { label: 'Vu', value: 2 },
    { label: 'Abandon', value: 3 }
  ];

  // le component émet l'objet du bouton sélectionné
  @Output() selectedStatusEvent = new EventEmitter<any>();

  constructor(
    //privatet: MatButtonToggleAppearance
  ) { }

  // au click de l'utilisateur on émet l'objet du bouton sélectionné
  selectButton(button: any): void {
    this.selectedStatusEvent.emit(button);
  }
}
