import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';



@NgModule({
  declarations: [
  
    
  ],
  imports: [
    CommonModule,
    DashboardModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
    AuthorizeMenuModule,
    RoleModule,
    UserModule

  ]
})
export class ComponentsModule { }
