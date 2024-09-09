import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService, private userAuthService: UserAuthService, private router: Router, private spinner: NgxSpinnerService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    return next.handle(req).pipe(catchError(error => {

      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state) => {
            if (!state) {
              const url = this.router.url;
              if (url == "/products")
                this.toastrService.message("Sepete Ürün Eklemek İçin Oturum Açınız !", "Oturum Açınız.", {
                  messageType: ToastrMesageType.Warning,
                  position: ToasterPosition.TopRight
                });
              else
                this.toastrService.message("Bu İşlemi Yapmaya Yetkiniz Yok...", "Yetkisiz İşlem !", {
                  messageType: ToastrMesageType.Warning,
                  position: ToasterPosition.TopRight
                });
            }
          }).then(data => {
            this.toastrService.message("Bu İşlemi Yapmaya Yetkiniz Yok...", "Yetkisiz İşlem !", {
              messageType: ToastrMesageType.Warning,
              position: ToasterPosition.TopRight
            });
          });

        break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya Erişilemiyor...", "Sunucu Hatası!", {
            messageType: ToastrMesageType.Warning,
            position: ToasterPosition.TopRight
          });
        break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Geçersiz İstek Yapıldı...", "Geçersiz istek!", {
            messageType: ToastrMesageType.Warning,
            position: ToasterPosition.TopRight
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa Bulunamadı...", "Sayfa Bulunamadı!", {
            messageType: ToastrMesageType.Warning,
            position: ToasterPosition.BottomFullWidth
          });
          break;
        default:
          this.toastrService.message("Beklenmeyen bir Hata İle Karşılaşıldı...", "Hata!", {
            messageType: ToastrMesageType.Warning,
            position: ToasterPosition.TopRight
          });
        break;
      }
      this.spinner.hide(SpinnerType.LineScale);
      this.spinner.hide(SpinnerType.LineScalePulseOut);
      return of(error);
    }));
  }
}
