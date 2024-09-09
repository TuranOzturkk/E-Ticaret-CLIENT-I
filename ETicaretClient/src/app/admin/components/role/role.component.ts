import { Component, OnInit, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {

  ngOnInit(): void {
     
  }

  @ViewChild(ListComponent) listComponents: ListComponent
  createdRole(createdRole: string) {
    this.listComponents.getRoles();
  }
}
