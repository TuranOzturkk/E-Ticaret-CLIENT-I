import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClientService: HttpClientService) { }

  async getRoles(page: number, size: number, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: "roles",
      queryString: `page=${page}&size=${size}`
      /*page ve size bilgilerini -1 gönderirseniz bütün verileri elde edersiniz sayfalama yapmaksızın */
    });
    const promisData = firstValueFrom(observable);
    promisData.then(successCallBack).catch(errorCallBack);

    return await promisData; 
  }

  async create(name: string, successCallback?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "roles"
    }, { name: name });
    const promiseDate = firstValueFrom(observable);
    promiseDate.then(successCallback).catch(errorCallBack);

    return await promiseDate as { succeeded: boolean };

  }
}
