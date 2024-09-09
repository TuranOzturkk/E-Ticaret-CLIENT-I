import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../services/common/models/order.service';
import { SingleOrder } from '../../contracts/order/single_order';
import { DialogService } from '../../services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { CustomToastrService, ToasterPosition, ToastrMesageType, ToastrOptions } from '../../services/ui/custom-toastr.service';
import { Position } from '../../services/admin/alertify.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss'
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string, private orderService: OrderService, private dialogService: DialogService, private spinner: NgxSpinnerService, private toastrService: CustomToastrService) {
    super(dialogRef)
  }
  singleOrder: SingleOrder;
  
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();
  totalPrice : number;

  async ngOnInit(): Promise<void> {
    this.singleOrder = await this.orderService.getOrderById(this.data as string)
    this.dataSource = this.singleOrder.basketItems;

    this.totalPrice = this.singleOrder.basketItems.map((basketItem, index) => basketItem.price * basketItem.quantity).reduce((price, current) => price + current);

  }
  complateOrder() {
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: CompleteOrderState.Evet,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.LineScale)
        await this.orderService.completeOrder(this.data as string);
        this.spinner.hide(SpinnerType.LineScale)
        this.toastrService.message("Sipariş Başarılıyla Tamamlanmıştır. Müşteriye Mail Gönderilmiştir.", "Sipariş Tamamlandı", {
          messageType: ToastrMesageType.Success,
          position: ToasterPosition.TopRight
        });
      }
    });
  }

}
export enum OrderDetailDialogState {
  Kapat,
  Bitir
}

