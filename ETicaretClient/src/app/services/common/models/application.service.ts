import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Menu } from '../../../contracts/application-configurations/menu';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService: HttpClientService) { }

  async GetAuthorizeDefinitionEndpoints() {
    const observable: Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller: "ApplicationServices",
    });
    return await firstValueFrom(observable);
  }
}
