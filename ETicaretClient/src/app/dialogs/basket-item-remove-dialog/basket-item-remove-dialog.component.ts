import { Component, Inject, OnDestroy } from '@angular/core';
import { extend } from 'jquery';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteState } from '../delete-dialog/delete-dialog.component';
declare var $: any;
@Component({
  selector: 'app-basket-item-remove-dialog',
  templateUrl: './basket-item-remove-dialog.component.html',
  styleUrl: './basket-item-remove-dialog.component.scss'
})
export class BasketItemRemoveDialogComponent extends BaseDialog<BasketItemRemoveDialogComponent> implements OnDestroy {
  constructor(dialogRef: MatDialogRef<BasketItemRemoveDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: BasketItemDeleteState) {
    super(dialogRef)
  }
    ngOnDestroy(): void {
      $("#basketModal").modal("show");
    }
}
export enum BasketItemDeleteState {
  Evet,
  Hayır
}
