import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsModule } from '../../../ui/components/products/products.module';
import { HomeModule } from '../../../ui/components/home/home.module';
import { BasketsModule } from '../../../ui/components/baskets/baskets.module';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ProductsModule,
    HomeModule,
    BasketsModule,
    RouterModule,
    MatListModule,
    MatButtonModule
   
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
  
 
})
export class ComponentsModule { }

