import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() type: string = 'alert';
  @Input() showAction: boolean = false;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>();

  constructor() {}

  close() {
    this.closeModal.emit(false);
  }
}
