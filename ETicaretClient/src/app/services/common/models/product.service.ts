import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from '../../../contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, SuccessCallBack?: () => void, errorCallback?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "Products"
    }, product)
      .subscribe(result => {
      SuccessCallBack();
    }, (errorResponse: HttpErrorResponse) => {
      const _erorr: Array<{ key: string, value: Array<String> }> = errorResponse.error;
      let message = "";
      _erorr.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        });
      })
      errorCallback(message);
    });
  }

  async read(page: number = 0, size: number = 10, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const promiseData: Promise<{ totalProductCount: number; products: List_Product[] }> =
      this.httpClientService.get<{ totalProductCount: number; products: List_Product[] }>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message))

    return await promiseData;
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);
   var a = await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, SuccessCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "products"
    }, id);
    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    SuccessCallBack();
    return images;

  }

  async deleteImage(id: string, imageId: string, SuccessCallBack?: () => void) {
   
    const deleteObservable =  this.httpClientService.delete({
      controller: "products",
      action: "deleteproductimage",
      queryString: `imageId=${imageId}`

    }, id)
    
    await firstValueFrom(deleteObservable);
    SuccessCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void> {
    const changeShowCaseImageObservable = this.httpClientService.get({
      controller: "products",
      action:"ChangeShowcaseImage",
      queryString: `imageId=${imageId}&productId=${productId}`
    });
    await firstValueFrom(changeShowCaseImageObservable);
    successCallBack();
  }

  async updateStockQrCodeToProduct(productId: string, stock: number, successCallBack?: () => void) {
    const observable = this.httpClientService.Put({
      controller: "products",
      action: "qrcode"
    }, { productId, stock })
    await firstValueFrom(observable);
    successCallBack();
  }
}
