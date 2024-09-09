import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { AuthService, _isAuthenticaticated } from '../../services/common/auth.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router, private toastrService: CustomToastrService, private spinner: NgxSpinnerService) { }

    canActivate(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot) {
        this.spinner.show(SpinnerType.LineScalePulseOut);

        //const token: string = localStorage.getItem("accessToken");
        //const decodeToken = this.jwtHelper.decodeToken(token);
        //const expirationDate: Data = this.jwtHelper.getTokenExpirationDate(token);
        //let expired: boolean;

        //try {
        //    expired = this.jwtHelper.isTokenExpired(token);
        //} catch {
        //    expired = true;
        //}

      if (!_isAuthenticaticated) {
            this.router.navigate(["login"], { queryParams: { returnUrl: satate.url } });
            this.toastrService.message("Oturum Açmanız Gerekli.", "Yetkisiz Erişim!", {
              messageType: ToastrMesageType.Warning,
              position: ToasterPosition.BottomFullWidth
            });
        }
        this.spinner.hide(SpinnerType.LineScalePulseOut);
        return true;
    }

}
