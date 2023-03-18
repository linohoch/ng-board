import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private box = new Subject<any>()
  current = this.box.asObservable()
  constructor() { }
  sendItem(data: any){
    this.box.next(data)
  }
  getItem(){
    return this.current
  }
}
