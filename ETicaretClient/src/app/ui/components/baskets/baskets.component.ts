import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasketsService } from '../../../services/common/models/baskets.service';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { OrderService } from '../../../services/common/models/order.service';
import { Create_Order } from '../../../contracts/order/create_order';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../../services/ui/custom-toastr.service';
import { Position } from '../../../services/admin/alertify.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/common/dialog.service';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from '../../../dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteState } from '../../../dialogs/shopping-complete-dialog/shopping-complete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.scss'
})
export class BasketsComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private basketService: BasketsService, private orderService: OrderService, private customToastrService: CustomToastrService, private router: Router, private dialogService: DialogService) {
    super(spinner);
  }
  basketItems: List_Basket_Item[];

  async ngOnInit(): Promise<void>{
    this.showSpinner(SpinnerType.LineScale)
    this.basketItems = await this.basketService.get()
    this.hideSpinner(SpinnerType.LineScale)
  }

  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.LineScale)
    const basketItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.LineScale)
  }

  async removeBasketItem(basketItemId: string) {

    $("#basketModal").modal("hide");
    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Evet,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.LineScale);
        await this.basketService.remove(basketItemId);
        $("#basketModal").modal("show");
        $("." + basketItemId).fadeOut(1000, () => this.hideSpinner(SpinnerType.LineScale))
      }
    });
  }

  shoppingComplete() {
    $("#basketModal").modal("hide");
    this.dialogService.openDialog({
      componentType: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteState.Evet,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.LineScale);
        const order: Create_Order = new Create_Order();
        order.address = "dikmen";
        order.description = "genel bilgiler...";
        await this.orderService.create(order);
        this.hideSpinner(SpinnerType.LineScale);
        this.customToastrService.message("Sipariş Oluşturuldu...", "Sipariş Durumu.", {
          messageType: ToastrMesageType.Info,
          position: ToasterPosition.BottomRight
        })
        this.router.navigate(["/"]);
      }
    });
  }
}
