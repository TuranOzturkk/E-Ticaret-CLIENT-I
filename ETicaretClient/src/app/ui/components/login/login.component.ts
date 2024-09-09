import { Component, OnInit} from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from '../../../services/common/http-client.service';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { async } from 'rxjs';
import { UserAuthService } from '../../../services/common/models/user-auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService) {
    super(spinner)

    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user)
      this.showSpinner(SpinnerType.LineScale);

      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.LineScale);
          })
        break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.LineScale);
          })
        break;

      }
    });
  }

    ngOnInit(): void {
        
    }
  
  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.LineScalePulseOut);
    await this.userAuthService.login(usernameOrEmail, password, () => {

      this.authService.identityCheck();

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
      });
      this.hideSpinner(SpinnerType.LineScalePulseOut);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
