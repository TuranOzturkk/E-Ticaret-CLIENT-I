import { Component, ViewChild } from '@angular/core';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { ComponentType, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  constructor(public authService: AuthService, private toasterService: CustomToastrService, private router: Router, private dynamicLoadComponentService: DynamicLoadComponentService) {
    authService.identityCheck();
  }
  signOut() {
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""]);
    this.toasterService.message("Oturum Kapatıldı..", "Çıkış Yapıldı", {
      messageType: ToastrMesageType.Success,
      position: ToasterPosition.BottomRight
    });
  }
  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }
}
