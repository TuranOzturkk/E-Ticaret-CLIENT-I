import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '../../services/common/models/role.service';
import { List_Role } from '../../contracts/role/List_Role';
import { MatSelectionList } from '@angular/material/list';
import { SpinnerType } from '../../base/base.component';
import { UserService } from '../../services/common/models/user.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrl: './authorize-user-dialog.component.scss'
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {
  constructor(dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private spinner: NgxSpinnerService) {
    super(dialogRef)
  }
  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: Array<string>;
  listRoles: { name: string, selected: boolean }[];

  async ngOnInit() {
    this.spinner.show(SpinnerType.LineScale);
    this.assignedRoles = await this.userService.getRolesToUser(this.data, () => this.spinner.hide(SpinnerType.LineScale));
    this.roles = await this.roleService.getRoles(-1, -1);

    this.listRoles = this.roles.datas.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedRoles?.indexOf(r.name) > -1
      }
    });
  }

  assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._elementRef.nativeElement.innerText);
    this.spinner.show(SpinnerType.LineScale);
    this.userService.assignRoleToUser(this.data, roles,
      () => {
        this.spinner.hide(SpinnerType.LineScale);
      }, error => {

      });
  }
}

