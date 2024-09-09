import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { RoleService } from '../../../../services/common/models/role.service';
import { List_Role } from '../../../../contracts/role/List_Role';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spiner: NgxSpinnerService, private roleService: RoleService, private alertifyService: AlertifyService, private dialogService: DialogService) {
    super(spiner)
  }

  displayedColumns: string[] = ['name', 'update', 'delete'];
  dataSource: MatTableDataSource<List_Role> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getRoles() {

    this.showSpinner(SpinnerType.LineScale);
    const allRoles: { datas: List_Role[], totalCount: number } = await this.roleService.getRoles(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 10, () => this.hideSpinner(SpinnerType.LineScale), errorMessage => this.alertifyService.message(errorMessage, {
      dismissOthers: true,
      messageType: MessageType.Error,
      position: Position.BottomRight
    }))



    this.dataSource = new MatTableDataSource<List_Role>(allRoles.datas);
    this.paginator.length = allRoles.totalCount;
  }
  

  async pageChanged() {
    await this.getRoles();
  }
  async ngOnInit() {
    await this.getRoles();
  }

}
