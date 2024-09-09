import { Component, OnInit, ViewChild } from '@angular/core';
import { extend } from 'jquery';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { List_Users } from '../../../../contracts/users/list_users';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../../../services/common/models/user.service';
import { AuthorizeUserDialogComponent } from '../../../../dialogs/authorize-user-dialog/authorize-user-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spiner: NgxSpinnerService,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService) {
    super(spiner)
  }

  displayedColumns: string[] = ['userName', 'nameSurname', 'email', 'twoFactorEnabled','role','delete'];
  dataSource: MatTableDataSource<List_Users> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getUsers() {
    this.showSpinner(SpinnerType.LineScale);
    const allUsers: { totalUsersCount: number; users: List_Users[] } = await this.userService.getAllUsers(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 10, () => this.hideSpinner(SpinnerType.LineScale), errorMessage => this.alertifyService.message(errorMessage, {
      dismissOthers: true,
      messageType: MessageType.Error,
      position: Position.BottomRight
    }))
    this.dataSource = new MatTableDataSource<List_Users>(allUsers.users);
    this.paginator.length = allUsers.totalUsersCount;
  }

  async pageChanged() {
    await this.getUsers();
  }
  async ngOnInit() {
    await this.getUsers();
  }

  assignRole(id: string) {
    this.dialogService.openDialog({
      componentType: AuthorizeUserDialogComponent,
      data: id,
      options: {
        width: "1000px",
        height: "80%"
      },
      afterClosed: () => {
        this.alertifyService.message("Roller Başarılı Bir Şekilde Atanmıştır.", {
          messageType: MessageType.Success,
          position: Position.TopRight
        });
      }
    });
  }
}
