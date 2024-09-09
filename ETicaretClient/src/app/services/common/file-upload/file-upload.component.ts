import { Component, Input, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToasterPosition, ToastrMesageType } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from '../../../dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService
  ) { }

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUplodOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const filedata: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        filedata.append(_file.name, _file, file.relativePath);

      });
    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.LineScale)
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, filedata).subscribe(data => {

          const message: string = "Dosyalar Başarılı Bir Şekilde Yüklendi.";
          this.spinner.hide(SpinnerType.LineScale)

          if (this.options.isAdminPage) {
            this.alertifyService.message(message,
              {
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.BottomRight
              }
            )
          } else {
            this.customToastrService.message(message, "Başarılı.", {
              messageType: ToastrMesageType.Success,
              position: ToasterPosition.BottomRight

            })
          }
          

        }, (errorResponse: HttpErrorResponse) => {

          const message: string = "Dosyalar Yüklenemedi.";
          this.spinner.hide(SpinnerType.LineScale)

          if (this.options.isAdminPage) {
            this.alertifyService.message(message,
              {
                dismissOthers: true,
                messageType: MessageType.Error,
                position: Position.BottomRight
              }
            )
          } else {
            this.customToastrService.message(message, "Başarısız.", {
              messageType: ToastrMesageType.Error,
              position: ToasterPosition.BottomRight

            })
          }
          
        });
      }
    }); 
  }
}
export class FileUplodOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: Boolean = false;
}
