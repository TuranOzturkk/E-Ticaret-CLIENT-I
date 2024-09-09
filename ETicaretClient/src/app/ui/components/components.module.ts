import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { BasketsModule } from './baskets/baskets.module';
import { ProductsModule } from './products/products.module';

import { RegisterModule } from './register/register.module';

import { LoginModule } from './login/login.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { UpdatePasswordModule } from './update-password/update-password.module';




@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HomeModule,
    BasketsModule,
    ProductsModule,
    RegisterModule,
    PasswordResetModule,
    UpdatePasswordModule
    /*LoginModule*/
  ],
  exports: [
    BasketsModule
  ]

})
export class ComponentsModule { }
