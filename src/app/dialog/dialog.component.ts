import {
  Component,
  Inject,
  Injectable,
  OnInit,
} from '@angular/core';
import {Dialog, DIALOG_DATA, DialogRef} from "@angular/cdk/dialog";

export interface DialogData {
  title: string;
  contents?: string;
  btn?:{
    ok: string;
    no: string;
  },
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [Dialog]
})
export class DialogComponent implements OnInit{
  data: any;
  constructor(public dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public dialogData: DialogData,) {
  }
  ngOnInit() {
    this.data = this.dialogData
  }
}

@Injectable({providedIn: 'root'})
export class DialogControl {
  constructor(public dialog: Dialog,) {}
    openDialog(data: DialogData): any {
      // const dialogRef =
      return this.dialog.open(
        DialogComponent,
        {
          width: '300px',
          data: {...data},
          autoFocus: "dialog",
        },
      );
      // dialogRef.closed.subscribe(answer => {
      //   console.log('in ref ',answer)
      //   return answer
      // });
  }
}
@Injectable({providedIn: 'root'})
export class DialogControl_2 {
  constructor(public dialog: Dialog,) {}
  openDialog(data: DialogData): any {
    let result;
    const dialogRef = this.dialog.open(
      DialogComponent,
      {
        width: '300px',
        data: {...data},
        autoFocus: "dialog",
      },
    );
    dialogRef.closed.subscribe(answer => {
      result = answer
    });
    return result
  }
}

