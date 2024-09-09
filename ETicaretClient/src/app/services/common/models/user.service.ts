import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { Create_User } from '../../../contracts/users/create_users';
import { Observable, first, firstValueFrom } from 'rxjs';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../ui/custom-toastr.service';
import { List_Users } from '../../../contracts/users/list_users';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }

  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "update-password"
    }, {
      userId: userId,
      resetToken: resetToken,
      password: password,
      passwordConfirm: passwordConfirm
    });
    const promisData: Promise<any> = firstValueFrom(observable);
    promisData.then(value => successCallBack()).catch(error => errorCallBack(error));
    await promisData;
  }

  async getAllUsers(page: number = 0, size: number = 10, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalUsersCount: number; users: List_Users[] }> {
    const observable: Observable<{ totalUsersCount: number; users: List_Users[] }> = this.httpClientService.get({
      controller: "users",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async assignRoleToUser(id: string, roles: string[], succesCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-to-user"
    }, { userId: id, roles: roles });

    const promiseData = firstValueFrom(observable);
    promiseData.then(() => succesCallBack()).catch(error => errorCallBack(error));
    await promiseData;
  }

  async getRolesToUser(userId: string, succesCallBack?: () => void, errorCallBack?: (error) => void): Promise<string[]> {
    const observable: Observable<{ userRoles: string[] }> = this.httpClientService.get({
      controller: "Users",
      action:"get-roles-to-user"
    }, userId);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => succesCallBack()).catch(error => errorCallBack(error));

    return (await promiseData).userRoles;
  }
}
