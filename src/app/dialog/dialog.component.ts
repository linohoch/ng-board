import {
  Component,
  Inject,
  Injectable,
  Optional,
  NgZone,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewContainerRef, Input
} from '@angular/core';
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
  styleUrls: ['./dialog.component.scss'],
  providers: [MatDialog]
})
export class DialogComponent implements OnInit{
  data: any;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,) {
  }
    // @Input() props: DialogData | undefined
  ngOnInit() {
    this.data = this.dialogData
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   this.data= changes['props'].currentValue
  //   console.log('ssss')
  // }

  onClick(ok: boolean) {
    this.dialogRef.close(ok);
  }
}

// @Component({
//   selector: 'dialog-control',
//   templateUrl: './control.component.html',
// })
@Injectable({providedIn: 'root'})
export class DialogControl {
  res: boolean | undefined = false

  constructor(public dialog: MatDialog,) {}
    openDialog(data: DialogData): any {
    this.dialog.open(
      DialogComponent,
      {
        restoreFocus: false,
        width: '300px',
        height: '200px',
        data: {...data},
        autoFocus: "dialog",
      },
    );
    // return dialogRef
    // dialogRef.afterClosed().subscribe(result => {
    //   this.res = result
    //   console.log('in ref ',result)
    //   return result
    // });
  }
}
