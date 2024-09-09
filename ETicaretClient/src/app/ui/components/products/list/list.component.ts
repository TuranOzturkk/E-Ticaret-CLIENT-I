import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { List_Product } from '../../../../contracts/list_product';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../services/common/models/file.service';
import { BaseUrl } from '../../../../contracts/base_url';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasketsService } from '../../../../services/common/models/baskets.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { Create_Basket_Item } from '../../../../contracts/basket/create_basket_item';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService, spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute, private fileService: FileService, private basketService: BasketsService, private customTousterService: CustomToastrService) {
    super(spinner)
  }
  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 16;
  pageList: number[] = [];
  baseUrl: BaseUrl;

  products: List_Product[];
  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();
     this.activatedRoute.params.subscribe(async params => {
     this.currentPageNo = parseInt(params["pageNo"] ?? 1);


      const data: { totalProductCount: number, products: List_Product[] } = await this.productService.read(this.currentPageNo - 1, this.pageSize, () => {

      },
      errorMessage => {

      });
       this.products = data.products;

       this.products = this.products.map<List_Product>(p => {
         const listProduct : List_Product = {
           name: p.name,
           id: p.id,
           price: p.price,
           stock: p.stock,
           updatedDate: p.updatedDate,
           createdDate: p.createdDate,
           imagePath: p.productImageFiles.length ? p.productImageFiles.find(p => p.showcase).path : "",
           productImageFiles: p.productImageFiles
         };
         return listProduct;

       });


       this.totalProductCount = data.totalProductCount;
       this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
       this.pageList = [];

       if (this.currentPageNo - 3 <= 0)
         for (let i = 1; i <= 7; i++)
           this.pageList.push(i);

       else if (this.currentPageNo + 3 >= this.totalPageCount)
         for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
           this.pageList.push(i);

       else
         for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
           this.pageList.push(i);

       
    });

  }

  async addToBasket(product: List_Product) {
    this.showSpinner(SpinnerType.LineScale);
    let _basketItem: Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.add(_basketItem);
    this.hideSpinner(SpinnerType.LineScale);
    this.customTousterService.message("Ürün Sepete Eklendi.", "", {
      messageType: ToastrMesageType.Success,
      position: ToasterPosition.BottomRight
    })
  }
}
