import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { List_Order } from '../../../../contracts/order/list_order';
import { OrderService } from '../../../../services/common/models/order.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { OrderDetailDialogComponent, OrderDetailDialogState } from '../../../../dialogs/order-detail-dialog/order-detail-dialog.component';

declare var $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spiner: NgxSpinnerService, private orderService: OrderService, private alertifyService: AlertifyService, private dialogService: DialogService) {
    super(spiner)
  }

  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice', 'createdDate','completed', 'viewdetail', 'delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getOrders() {
    this.showSpinner(SpinnerType.LineScale);
    const allOrders: { totalOrderCount: number; orders: List_Order[] } = await this.orderService.getAllOrders(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 10, () => this.hideSpinner(SpinnerType.LineScale),
      (errorMessage: any) => {
      this.alertifyService.message(errorMessage.message, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.BottomRight
      });
    })
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
  }

  
  async pageChanged() {
    await this.getOrders();
  }
  async ngOnInit() {
    await this.getOrders();
  }
  showDetail(id: string) {
    this.dialogService.openDialog({
      componentType: OrderDetailDialogComponent,
      data: id,
      options: {
        width: "1000px",
        height:"80%"
      }
    });
  }
}
