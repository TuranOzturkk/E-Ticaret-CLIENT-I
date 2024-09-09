import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AdminModule } from "./admin/admin.module";
import { UiModule } from "./ui/ui.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { BaseComponent } from './base/base.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FileUploadDialogComponent } from './dialogs/file-upload-dialog/file-upload-dialog.component';
import { JwtModule } from "@auth0/angular-jwt";
import { LoginComponent } from "./ui/components/login/login.component";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "@abacritt/angularx-social-login";
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from "./services/common/http-error-handler-interceptor.service";
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DynamicLoadComponentDirective
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    AdminModule,
    UiModule,
    NgxSpinnerModule,
    HttpClientModule,
    GoogleSigninButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem("accessToken"),
        allowedDomains: ["localhost:7155"]
      }
    }),
    SocialLoginModule
  ],
  providers: [
    { provide: "baseUrl", useValue: "https://localhost:7155/api", multi: true },
    { provide: "baseSignalRUrl", useValue: "https://localhost:7155/", multi: true },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("701021073342-1eoj4ufcrgtjru609q5krgftfflal2ge.apps.googleusercontent.com")
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("329570952802936")
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorHandlerInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
