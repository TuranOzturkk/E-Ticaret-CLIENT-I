import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { RoleService } from '../../../../services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(spiner: NgxSpinnerService, private roleService: RoleService, private alertify: AlertifyService) {
    super(spiner)
  }

  ngOnInit(): void {

  }
  @Output() createdRole: EventEmitter<string> = new EventEmitter();

  create(name: HTMLInputElement) {
    this.showSpinner(SpinnerType.LineScale);




    this.roleService.create(name.value, () => {
      this.hideSpinner(SpinnerType.LineScale);
      this.alertify.message("Rol Ekleme Başarılı...", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.BottomRight
      });
      this.createdRole.emit(name.value);
    }, errorMessage => {
      this.alertify.message(errorMessage,
        {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.BottomRight
        });
    });
  }
}
