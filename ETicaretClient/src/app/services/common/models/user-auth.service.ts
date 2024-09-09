import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../ui/custom-toastr.service';
import { Observable, firstValueFrom } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { usernameOrEmail, password })

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Kullanıcı Girişi Başarılı.", "Giriş Başarılı", {
        messageType: ToastrMesageType.Success,
        position: ToasterPosition.BottomRight
      })
    }
    callBackFunction();
  }

  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state) => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    }, { refreshToken: refreshToken });

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }

      callBackFunction(tokenResponse ? true : false);

    } catch {
      callBackFunction(false);
    }
  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "google-login"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Google üzerinden giriş başarılı bir şekilde gerçekleşti.", "Giriş Başarılı", {
        messageType: ToastrMesageType.Success,
        position: ToasterPosition.BottomRight
      })
    }
    callBackFunction();
  }

  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "facebook-login"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Facebook üzerınden giriş sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMesageType.Success,
        position: ToasterPosition.BottomRight
      })
    }
    callBackFunction();
  }

  async passwordReset(email: string, callBackFunction?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, { email: email });
    await firstValueFrom(observable);
    callBackFunction();
  }

  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean>  {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, { resetToken: resetToken, userId: userId });

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
  
}
