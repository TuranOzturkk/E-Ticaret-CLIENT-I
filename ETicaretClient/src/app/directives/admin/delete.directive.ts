import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { HttpClientService } from '../../services/common/http-client.service';
import { ProductService } from '../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';



declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  )
  {
    
    const img = _renderer.createElement("img");
    img.setAttribute("src", "../../../../../assets/delete.png");
    img.setAttribute("style", "cursor: pointer;");
    img.windth = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @HostListener("click")

  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.LineScale);
        const td: HTMLTableCellElement = this.element.nativeElement;
        this.httpClientService.delete({
          controller: this.controller
        }, this.id).subscribe(data => {
          $(td.parentElement).animate({
            opacity: 0,
            left: "+=50",
            height: "toogle"
          }, 700, () => {
            this.callback.emit();
            this.alertifyService.message(`${this.controller == 'roles' ? 'Rol' : 'Ürün'} Başarılı Bir Şekilde Silinmiştir...`, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.BottomRight
            })
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.LineScale);
          this.alertifyService.message("Ürün Silme İşlemi Başarısız !", {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.BottomRight
          });
        });
      }
    });
  }

  //openDialog(afterClosed: any): void {
  //  const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //    width: '310px',
  //    data: DeleteState.Yes,
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    if (result == DeleteState.Yes) {
  //      afterClosed();
  //    }
  //  });
  //}

}
