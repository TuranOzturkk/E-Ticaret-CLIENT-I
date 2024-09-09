import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { Create_User } from '../../../contracts/users/create_users';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../../services/ui/custom-toastr.service';
import { Position } from '../../../services/admin/alertify.service';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastrService: CustomToastrService, spinner: NgxSpinnerService) {
    super(spinner)}

  frm: FormGroup;

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      username: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      email: ["", [Validators.required, Validators.maxLength(250), Validators.email]],

      password: ["", [Validators.required]],
      passwordConfirm: ["", [Validators.required]]

    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        
        let password = group.get("password").value;
        let passwordConfirm = group.get("passwordConfirm").value;
                  
        return password === passwordConfirm ? null : { notSame: true };
      }
    })
  }

  get component() {
    return this.frm.controls;
  }

  submitted: boolean = false;

  async onSubmit(user: User) {
    this.submitted = true;
    
    if (this.frm.invalid)
      return;

    const result: Create_User = await this.userService.create(user);

    if (result.succeeded)
      this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı.", {
        messageType: ToastrMesageType.Success,
        position: ToasterPosition.BottomRight
      })
      else
      this.toastrService.message(result.message, "Kullanıcı Kayıt Hatası.", {
        messageType: ToastrMesageType.Error,
        position: ToasterPosition.BottomRight
      })
      
    
  }
}
