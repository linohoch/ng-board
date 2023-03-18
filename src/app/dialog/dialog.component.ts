import {Component, Inject, Injectable, Optional, NgZone} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  contents?: string;
  btn?:{
    okBtnText: string;
    noBtnText: string;
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData,) {
  }

  onClick(ok: boolean) {
    this.dialogRef.close(ok);
  }
}

@Injectable({providedIn: 'root'})
export class DialogControl {
  res: boolean | undefined = false

  constructor(public dialog: MatDialog,) {
  }

    openDialog(data: DialogData): any {
    const dialogRef = this.dialog.open(
      DialogComponent,
      {
        width: '300px',
        data: {...data},
        enterAnimationDuration: '0ms'
      },
    );
    return dialogRef
    // dialogRef.afterClosed().subscribe(result => {
    //   this.res = result
    //   console.log('in ref ',result)
    //   return result
    // });
  }
}
