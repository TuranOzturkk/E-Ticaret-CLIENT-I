import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUplodOptions } from '../../../../services/common/file-upload/file-upload.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(spiner: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService) {
    super(spiner)
    }

  ngOnInit(): void {

  }
  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

  create(Name: HTMLInputElement, Stock: HTMLInputElement, Price: HTMLInputElement) {
    this.showSpinner(SpinnerType.LineScale);
    const create_product: Create_Product = new Create_Product();
    create_product.name = Name.value;
    create_product.stock = parseInt(Stock.value);
    create_product.price = parseFloat(Price.value);


    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.LineScale);
      this.alertify.message("Ürün Ekleme Başarılı...", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.BottomRight
      });
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.alertify.message(errorMessage,
        {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.BottomRight
        });
    });
  }
}
