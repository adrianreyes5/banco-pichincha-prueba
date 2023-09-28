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
  @Input() productId: string = 'false';
  @Input() loading: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() handleAction = new EventEmitter<string>();
  @Output() handleLoading = new EventEmitter<boolean>();

  constructor() {}
}
