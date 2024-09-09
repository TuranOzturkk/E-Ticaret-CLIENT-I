import { MatDialogRef } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";

export class BaseDialog<DialogComponent> {
  constructor(public dialogRef: MatDialogRef<DialogComponent>) {

  }

  close() {
    this.dialogRef.close();
  }

}

