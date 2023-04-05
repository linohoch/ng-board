import { Injectable } from '@angular/core';
import {D} from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  calDate(date: any) {
    let time = Date.now() - Number(new Date(date))
    let result;
    if (time < 1000 * 60) {
      result = Math.trunc(time / (1000)) + '초전'
    } else if (time < 1000 * 60 * 60) {
      result = Math.trunc(time / (1000 * 60)) + '분전'
    } else if (time < 1000 * 60 * 60 * 24) {
      result = Math.trunc(time / (1000 * 60 * 60)) + '시간전'
    } else {
      result = Math.trunc(time / (1000 * 60 * 60 * 24)) + '일전'
    }
    return result
  }
}
